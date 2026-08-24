package vaelis_api.service;

import vaelis_api.entity.AdminActivityLog;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminActivityLogRepository;
import vaelis_api.repository.AdminUserRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AdminActivityLogService {

    private final AdminActivityLogRepository repository;
    private final AdminUserRepository adminUserRepository;

    public AdminActivityLogService(
            AdminActivityLogRepository repository,
            AdminUserRepository adminUserRepository) {

        this.repository = repository;
        this.adminUserRepository = adminUserRepository;
    }

    // =========================================================
    // LOG ADMIN ACTIVITY
    // =========================================================

@Transactional(
        propagation = Propagation.REQUIRES_NEW,
        readOnly = false
)
public AdminActivityLog log(
            String action,
            Long targetUserId,
            String targetUsername,
            String targetRole,
            String details,
            String result) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String actorUsername = "SYSTEM";
        String actorRole = "SYSTEM";

        if (authentication != null &&
                authentication.isAuthenticated()) {

            actorUsername =
                    authentication.getName();

            actorRole =
                    authentication
                            .getAuthorities()
                            .stream()
                            .filter(authority ->
                                    authority
                                            .getAuthority()
                                            .startsWith("ROLE_"))
                            .findFirst()
                            .map(authority ->
                                    authority
                                            .getAuthority()
                                            .substring(
                                                    "ROLE_".length()
                                            ))
                            .orElse("UNKNOWN");
        }

        AdminActivityLog activityLog =
                new AdminActivityLog();

        activityLog.setActorUsername(
                actorUsername
        );

        activityLog.setActorRole(
                actorRole
        );

        activityLog.setAction(
                action
        );

        activityLog.setTargetUserId(
                targetUserId
        );

        activityLog.setTargetUsername(
                targetUsername
        );

        activityLog.setTargetRole(
                targetRole
        );

        activityLog.setDetails(
                details
        );

        activityLog.setResult(
                result
        );

        activityLog.setCreatedAt(
                LocalDateTime.now()
        );

        return repository.save(
                activityLog
        );
    }

    // =========================================================
    // LOG ACTIVITY FOR TARGET USER
    // =========================================================

    @Transactional
    public AdminActivityLog log(
            String action,
            AdminUser targetUser,
            String details,
            String result) {

        if (targetUser == null) {

            return log(
                    action,
                    null,
                    null,
                    null,
                    details,
                    result
            );
        }

        return log(
                action,
                targetUser.getId(),
                targetUser.getUsername(),
                targetUser.getRole(),
                details,
                result
        );
    }

    // =========================================================
    // GET ALL ACTIVITY LOGS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminActivityLog>
    getAllLogs() {

        return repository
                .findAllByOrderByCreatedAtDesc();
    }
}