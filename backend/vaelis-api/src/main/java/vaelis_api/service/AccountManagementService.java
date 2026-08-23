package vaelis_api.service;

import vaelis_api.entity.AdminUser;
import vaelis_api.dto.AdminRegistrationRequest;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.security.AdminRoles;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountManagementService {

    private final AdminUserRepository adminUserRepository;

    private final PasswordEncoder passwordEncoder;

    private final AdminActivityLogService adminActivityLogService;

    public AccountManagementService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            AdminActivityLogService adminActivityLogService) {

        this.adminUserRepository =
                adminUserRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // CREATE ACCOUNT MANAGER
    // =========================================================

    @Transactional
    public AdminUser createAccountManager(
            AdminRegistrationRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Registration request is required."
            );
        }

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        String password =
                request.getPassword() == null
                        ? ""
                        : request.getPassword();

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        if (password.isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        if (password.length() < 8) {

            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters."
            );
        }

        if (adminUserRepository
                .findByUsernameIgnoreCase(username)
                .isPresent()) {

            throw new IllegalStateException(
                    "Username is already registered."
            );
        }

        if (adminUserRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            throw new IllegalStateException(
                    "Email is already registered."
            );
        }

        AdminUser accountManager =
                new AdminUser();

        accountManager.setUsername(
                username
        );

        accountManager.setEmail(
                email
        );

        accountManager.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        accountManager.setRole(
                AdminRoles.ACCOUNT_MANAGER
        );

        accountManager.setApproved(
                false
        );

        accountManager.setApprovedBy(
                null
        );

        accountManager.setApprovedAt(
                null
        );

        accountManager.setEnabled(
                false
        );

        AdminUser savedAccountManager =
                adminUserRepository.save(
                        accountManager
                );

        adminActivityLogService.log(
                "CREATE_ACCOUNT_MANAGER",
                savedAccountManager,
                "Account Manager registration created and is pending Super Admin approval.",
                "SUCCESS"
        );

        return savedAccountManager;
    }

    // =========================================================
    // GET MANAGEABLE USER ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser>
    getManageableUsers(
            String currentUsername) {

        String username =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        return adminUserRepository
                .findAll()
                .stream()
                .filter(user ->
                        user != null
                )
                .filter(user ->
                        !user.isDeleted()
                )
                .filter(user ->
                        !AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                                user.getRole()
                        )
                )
                .filter(user ->
                        user.getUsername() == null ||
                        !user.getUsername()
                                .equalsIgnoreCase(
                                        username
                                )
                )
                .toList();
    }

    // =========================================================
    // CREATE MANAGEABLE USER ACCOUNT
    // =========================================================

    @Transactional
    public AdminUser createUserAccount(
            AdminRegistrationRequest request,
            String role) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Registration request is required."
            );
        }

        String requestedRole =
                role == null
                        ? ""
                        : role.trim();

        if (requestedRole.isBlank()) {

            throw new IllegalArgumentException(
                    "Role is required."
            );
        }

        if (!AdminRoles.ADMIN.equalsIgnoreCase(
                requestedRole
        ) &&
                !AdminRoles.EMPLOYEE.equalsIgnoreCase(
                        requestedRole
                )) {

            throw new IllegalArgumentException(
                    "Only ADMIN and EMPLOYEE accounts can be created."
            );
        }

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        String password =
                request.getPassword() == null
                        ? ""
                        : request.getPassword();

        if (password.isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        if (password.length() < 8) {

            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters."
            );
        }

        if (adminUserRepository
                .findByUsernameIgnoreCase(username)
                .isPresent()) {

            throw new IllegalStateException(
                    "Username is already registered."
            );
        }

        if (adminUserRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            throw new IllegalStateException(
                    "Email is already registered."
            );
        }

        AdminUser user =
                new AdminUser();

        user.setUsername(
                username
        );

        user.setEmail(
                email
        );

        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        user.setRole(
                requestedRole.toUpperCase()
        );

        user.setApproved(
                false
        );

        user.setApprovedBy(
                null
        );

        user.setApprovedAt(
                null
        );

        user.setEnabled(
                false
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "CREATE_USER",
                savedUser,
                "Created " + savedUser.getRole()
                        + " account. Account is pending approval.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // UPDATE MANAGEABLE USER ACCOUNT
    // =========================================================

    @Transactional
    public AdminUser updateUserAccount(
            Long userId,
            AdminRegistrationRequest request,
            String currentUsername) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Update request is required."
            );
        }

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be modified."
            );
        }

        // =====================================================
        // DELETION REQUEST FREEZE
        // =====================================================

        if (user.isDeletionPending()) {

            throw new IllegalStateException(
                    "User account is frozen because a deletion request is pending Super Admin approval."
            );
        }

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be modified through Account Management."
            );
        }

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot modify your own account."
            );
        }

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        adminUserRepository
                .findByUsernameIgnoreCase(username)
                .ifPresent(existingUser -> {

                    if (!existingUser.getId()
                            .equals(user.getId())) {

                        throw new IllegalStateException(
                                "Username is already registered."
                        );
                    }
                });

        adminUserRepository
                .findByEmailIgnoreCase(email)
                .ifPresent(existingUser -> {

                    if (!existingUser.getId()
                            .equals(user.getId())) {

                        throw new IllegalStateException(
                                "Email is already registered."
                        );
                    }
                });

        user.setUsername(
                username
        );

        user.setEmail(
                email
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "UPDATE_USER",
                savedUser,
                "Updated username/email for user account.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // DISABLE USER ACCOUNT
    // =========================================================

    @Transactional
    public AdminUser disableUserAccount(
            Long userId,
            String currentUsername) {

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is already deleted."
            );
        }

        // =====================================================
        // DELETION REQUEST FREEZE
        // =====================================================

        if (user.isDeletionPending()) {

            throw new IllegalStateException(
                    "User account is frozen because a deletion request is pending Super Admin approval."
            );
        }

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be disabled through Account Management."
            );
        }

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot disable your own account."
            );
        }

        user.setEnabled(false);

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "DISABLE_USER",
                savedUser,
                "User account disabled.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // ENABLE USER ACCOUNT
    // =========================================================

    @Transactional
    public AdminUser enableUserAccount(
            Long userId) {

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be enabled."
            );
        }

        // =====================================================
        // DELETION REQUEST FREEZE
        // =====================================================

        if (user.isDeletionPending()) {

            throw new IllegalStateException(
                    "User account is frozen because a deletion request is pending Super Admin approval."
            );
        }

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be enabled through Account Management."
            );
        }

        if (!user.isApproved()) {

            throw new IllegalStateException(
                    "Account must be approved before it can be enabled."
            );
        }

        user.setEnabled(true);

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "ENABLE_USER",
                savedUser,
                "User account enabled.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // CHANGE USER PASSWORD
    // =========================================================

    @Transactional
    public AdminUser changeUserPassword(
            Long userId,
            String newPassword,
            String currentUsername) {

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        String password =
                newPassword == null
                        ? ""
                        : newPassword;

        if (password.isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        if (password.length() < 8) {

            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters."
            );
        }

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be modified."
            );
        }

        // =====================================================
        // DELETION REQUEST FREEZE
        // =====================================================

        if (user.isDeletionPending()) {

            throw new IllegalStateException(
                    "User account is frozen because a deletion request is pending Super Admin approval."
            );
        }

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN passwords cannot be changed through Account Management."
            );
        }

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot change your own password through Account Management."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "CHANGE_PASSWORD",
                savedUser,
                "User password changed by authorized account management personnel.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // GET PENDING DELETION REQUESTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser>
    getPendingDeletionRequests() {

        return adminUserRepository
                .findByDeletionPendingTrueAndDeletedFalseOrderByDeletionRequestedAtDesc();
    }

    // =========================================================
    // REQUEST USER ACCOUNT DELETION
    // =========================================================

    @Transactional
    public AdminUser deleteUserAccount(
            Long userId,
            String currentUsername) {

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        // =====================================================
        // ALREADY DELETED
        // =====================================================

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is already deleted."
            );
        }

        // =====================================================
        // ALREADY PENDING
        // =====================================================

        if (user.isDeletionPending()) {

            throw new IllegalStateException(
                    "A deletion request is already pending Super Admin approval."
            );
        }

        // =====================================================
        // NEVER DELETE SUPER ADMIN
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be deleted through Account Management."
            );
        }

        // =====================================================
        // PREVENT SELF DELETE
        // =====================================================

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot delete your own account."
            );
        }

        // =====================================================
        // REMEMBER PREVIOUS ENABLED STATE
        // =====================================================

        user.setDeletionPreviousEnabled(
                user.isEnabled()
        );

        // =====================================================
        // CREATE DELETION REQUEST
        // =====================================================

        user.setDeletionPending(
                true
        );

        user.setDeletionRequestedBy(
                currentUser
        );

        user.setDeletionRequestedAt(
                LocalDateTime.now()
        );

        // =====================================================
        // FREEZE ACCOUNT
        // =====================================================

        user.setEnabled(
                false
        );

        // =====================================================
        // DO NOT SOFT DELETE YET
        // =====================================================

        user.setDeleted(
                false
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "REQUEST_DELETE_USER",
                savedUser,
                "Account deletion requested by Account Manager. Account frozen pending Super Admin approval.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // APPROVE DELETION REQUEST
    // =========================================================

    @Transactional
    public AdminUser approveDeletionRequest(
            Long userId,
            String superAdminUsername) {

        String approver =
                superAdminUsername == null
                        ? ""
                        : superAdminUsername.trim();

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (!user.isDeletionPending()) {

            throw new IllegalStateException(
                    "No pending deletion request exists for this account."
            );
        }

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is already deleted."
            );
        }

        // =====================================================
        // APPROVE DELETION
        // =====================================================

        user.setDeletionPending(
                false
        );

        user.setDeletionApprovedBy(
                approver
        );

        user.setDeletionApprovedAt(
                LocalDateTime.now()
        );

        // =====================================================
        // ACTUAL SOFT DELETE
        // =====================================================

        user.setDeleted(
                true
        );

        user.setEnabled(
                false
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "APPROVE_DELETE_USER",
                savedUser,
                "Super Admin approved the deletion request. Account soft-deleted.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // REJECT DELETION REQUEST
    // =========================================================

    @Transactional
    public AdminUser rejectDeletionRequest(
            Long userId,
            String superAdminUsername,
            String reason) {

        String approver =
                superAdminUsername == null
                        ? ""
                        : superAdminUsername.trim();

        String rejectionReason =
                reason == null
                        ? ""
                        : reason.trim();

        if (rejectionReason.isBlank()) {

            throw new IllegalArgumentException(
                    "A rejection reason is required."
            );
        }

        if (rejectionReason.length() > 1000) {

            throw new IllegalArgumentException(
                    "Rejection reason cannot exceed 1000 characters."
            );
        }

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (!user.isDeletionPending()) {

            throw new IllegalStateException(
                    "No pending deletion request exists for this account."
            );
        }

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot have their deletion request rejected."
            );
        }

        // =====================================================
        // REJECT DELETION
        // =====================================================

        user.setDeletionPending(
                false
        );

        user.setDeletionRejectedBy(
                approver
        );

        user.setDeletionRejectedAt(
                LocalDateTime.now()
        );

        user.setDeletionRejectionReason(
                rejectionReason
        );

        // =====================================================
        // RESTORE PREVIOUS ENABLED STATE
        // =====================================================

        user.setEnabled(
                user.isDeletionPreviousEnabled()
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "REJECT_DELETE_USER",
                savedUser,
                "Super Admin rejected the deletion request. Reason: "
                        + rejectionReason,
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // RESTORE USER ACCOUNT
    // =========================================================

    @Transactional
    public AdminUser restoreUserAccount(
            Long userId) {

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be restored through Account Management."
            );
        }

        if (!user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is not deleted."
            );
        }

        user.setDeleted(
                false
        );

        user.setDeletionPending(
                false
        );

        user.setEnabled(
                false
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "RESTORE_USER",
                savedUser,
                "Deleted user account restored. Account remains disabled pending explicit enablement.",
                "SUCCESS"
        );

        return savedUser;
    }
}