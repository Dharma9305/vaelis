package vaelis_api.service;

import vaelis_api.entity.AdminLoginSession;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminLoginSessionRepository;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminLoginSessionService {

    // =========================================================
    // CONSTANTS
    // =========================================================

    public static final String STATUS_ACTIVE =
            "ACTIVE";

    public static final String STATUS_LOGGED_OUT =
            "LOGGED_OUT";

    public static final String STATUS_AUTO_LOGGED_OUT =
            "AUTO_LOGGED_OUT";

    public static final String STATUS_FORCED_LOGOUT =
            "FORCED_LOGOUT";

    public static final String REASON_USER_LOGOUT =
            "USER_LOGOUT";

    public static final String REASON_IDLE_TIMEOUT =
            "IDLE_TIMEOUT";

    public static final String REASON_ADMIN_FORCED =
            "ADMIN_FORCED";

    public static final String REASON_ACCOUNT_DISABLED =
            "ACCOUNT_DISABLED";

    public static final long IDLE_TIMEOUT_SECONDS =
            7 * 60;

    // =========================================================
    // DEPENDENCIES
    // =========================================================

    private final AdminLoginSessionRepository sessionRepository;

    private final AdminUserRepository adminUserRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    public AdminLoginSessionService(
            AdminLoginSessionRepository sessionRepository,
            AdminUserRepository adminUserRepository,
            AdminActivityLogService adminActivityLogService) {

        this.sessionRepository =
                sessionRepository;

        this.adminUserRepository =
                adminUserRepository;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // START / GET ACTIVE SESSION
    // =========================================================

    @Transactional
    public AdminLoginSession
    startOrRefreshSession(
            String username,
            String ipAddress,
            String userAgent) {

        if (username == null ||
                username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCaseAndDeletedFalse(
                                username.trim()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Admin account not found."
                                )
                        );

        LocalDateTime now =
                LocalDateTime.now();

        AdminLoginSession activeSession =
                sessionRepository
                        .findFirstByUsernameIgnoreCaseAndStatusOrderByLoginAtDesc(
                                adminUser.getUsername(),
                                STATUS_ACTIVE
                        )
                        .orElse(null);

        // =====================================================
        // EXISTING ACTIVE SESSION
        // =====================================================

        if (activeSession != null) {

            if (isIdleExpired(
                    activeSession,
                    now
            )) {

                autoLogout(
                        activeSession,
                        now
                );

                activeSession = null;
            }
        }

        // =====================================================
        // CREATE NEW SESSION
        // =====================================================

        if (activeSession == null) {

            AdminLoginSession session =
                    new AdminLoginSession();

            session.setAdminUserId(
                    adminUser.getId()
            );

            session.setUsername(
                    adminUser.getUsername()
            );

            session.setRole(
                    adminUser.getRole()
            );

            session.setLoginAt(
                    now
            );

            session.setLastActivityAt(
                    now
            );

            session.setStatus(
                    STATUS_ACTIVE
            );

            session.setIpAddress(
                    ipAddress
            );

            session.setUserAgent(
                    userAgent
            );

            AdminLoginSession saved =
                    sessionRepository.save(
                            session
                    );

            adminActivityLogService.log(
                    "ADMIN_LOGIN",
                    adminUser,
                    "Admin login session created.",
                    "SUCCESS"
            );

            return saved;
        }

        // =====================================================
        // REFRESH ACTIVITY
        // =====================================================

        activeSession.setLastActivityAt(
                now
        );

        activeSession.setIpAddress(
                ipAddress
        );

        activeSession.setUserAgent(
                userAgent
        );

        return sessionRepository.save(
                activeSession
        );
    }

    // =========================================================
    // CHECK ACTIVE SESSION
    // =========================================================

    @Transactional
    public boolean isSessionValid(
            String username) {

        if (username == null ||
                username.isBlank()) {

            return false;
        }

        AdminLoginSession session =
                sessionRepository
                        .findFirstByUsernameIgnoreCaseAndStatusOrderByLoginAtDesc(
                                username.trim(),
                                STATUS_ACTIVE
                        )
                        .orElse(null);

        if (session == null) {
            return false;
        }

        LocalDateTime now =
                LocalDateTime.now();

        // =====================================================
        // IDLE TIMEOUT
        // =====================================================

        if (isIdleExpired(
                session,
                now
        )) {

            autoLogout(
                    session,
                    now
            );

            return false;
        }

        // =====================================================
        // ACCOUNT STILL VALID
        // =====================================================

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCaseAndDeletedFalse(
                                username.trim()
                        )
                        .orElse(null);

        if (adminUser == null ||
                !adminUser.isEnabled()) {

            forceLogout(
                    session,
                    now,
                    REASON_ACCOUNT_DISABLED
            );

            return false;
        }

        // =====================================================
        // UPDATE ACTIVITY
        // =====================================================

        session.setLastActivityAt(
                now
        );

        sessionRepository.save(
                session
        );

        return true;
    }

    // =========================================================
// LOGOUT
// =========================================================

@Transactional
public void logout(
        String username,
        String logoutReason) {

    if (username == null ||
            username.isBlank()) {

        return;
    }

    AdminLoginSession session =
            sessionRepository
                    .findFirstByUsernameIgnoreCaseAndStatusOrderByLoginAtDesc(
                            username.trim(),
                            STATUS_ACTIVE
                    )
                    .orElse(null);

    if (session == null) {
        return;
    }

    LocalDateTime now =
            LocalDateTime.now();

    // =====================================================
    // AUTOMATIC IDLE TIMEOUT
    // =====================================================

    if (REASON_IDLE_TIMEOUT.equalsIgnoreCase(
            logoutReason
    )) {

        // -------------------------------------------------
        // SERVER-SIDE VERIFICATION
        // -------------------------------------------------

        if (!isIdleExpired(
                session,
                now
        )) {

            // Do NOT trust the browser blindly.
            // The server decides whether 7 minutes
            // of inactivity have actually elapsed.

            return;
        }

        autoLogout(
                session,
                now
        );

        return;
    }

    // =====================================================
    // NORMAL USER LOGOUT
    // =====================================================

    closeSession(
            session,
            now,
            STATUS_LOGGED_OUT,
            REASON_USER_LOGOUT
    );

    adminActivityLogService.log(
            "ADMIN_LOGOUT",
            session.getAdminUserId(),
            session.getUsername(),
            session.getRole(),
            "Admin logged out manually.",
            "SUCCESS"
    );
}
    // =========================================================
    // FORCE LOGOUT
    // =========================================================

    @Transactional
    public void forceLogout(
            AdminLoginSession session,
            LocalDateTime now,
            String reason) {

        if (session == null ||
                !STATUS_ACTIVE.equals(
                        session.getStatus()
                )) {

            return;
        }

        closeSession(
                session,
                now,
                STATUS_FORCED_LOGOUT,
                reason
        );

        adminActivityLogService.log(
                "ADMIN_FORCED_LOGOUT",
                session.getAdminUserId(),
                session.getUsername(),
                session.getRole(),
                "Admin session forcibly terminated. Reason: "
                        + reason,
                "SUCCESS"
        );
    }

    // =========================================================
    // AUTO LOGOUT
    // =========================================================

    @Transactional
    public void autoLogout(
            AdminLoginSession session,
            LocalDateTime now) {

        if (session == null ||
                !STATUS_ACTIVE.equals(
                        session.getStatus()
                )) {

            return;
        }

        closeSession(
                session,
                now,
                STATUS_AUTO_LOGGED_OUT,
                REASON_IDLE_TIMEOUT
        );

        adminActivityLogService.log(
                "ADMIN_AUTO_LOGOUT",
                session.getAdminUserId(),
                session.getUsername(),
                session.getRole(),
                "Admin automatically logged out after "
                        + IDLE_TIMEOUT_SECONDS
                        + " seconds of inactivity.",
                "SUCCESS"
        );
    }

    // =========================================================
    // GET ALL SESSIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminLoginSession>
    getAllSessions() {

        return sessionRepository
                .findAllByOrderByLoginAtDesc();
    }

    // =========================================================
    // GET USER SESSION HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminLoginSession>
    getUserSessionHistory(
            String username) {

        return sessionRepository
                .findByUsernameIgnoreCaseOrderByLoginAtDesc(
                        username
                );
    }

    // =========================================================
    // IDLE CHECK
    // =========================================================

    private boolean isIdleExpired(
            AdminLoginSession session,
            LocalDateTime now) {

        if (session.getLastActivityAt() == null) {
            return true;
        }

        long idleSeconds =
                Duration.between(
                        session.getLastActivityAt(),
                        now
                ).getSeconds();

        return idleSeconds >=
                IDLE_TIMEOUT_SECONDS;
    }

    // =========================================================
    // CLOSE SESSION
    // =========================================================

    private void closeSession(
            AdminLoginSession session,
            LocalDateTime now,
            String status,
            String reason) {

        session.setLogoutAt(
                now
        );

        session.setStatus(
                status
        );

        session.setLogoutReason(
                reason
        );

        if (session.getLoginAt() != null) {

            long duration =
                    Duration.between(
                            session.getLoginAt(),
                            now
                    ).getSeconds();

            session.setSessionDurationSeconds(
                    Math.max(duration, 0)
            );
        }

        sessionRepository.save(
                session
        );
    }
}