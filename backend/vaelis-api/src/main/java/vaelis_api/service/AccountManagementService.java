package vaelis_api.service;

import vaelis_api.entity.AdminUser;
import vaelis_api.dto.AdminRegistrationRequest;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.security.AdminRoles;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountManagementService {

    private final AdminUserRepository adminUserRepository;

    private final PasswordEncoder passwordEncoder;

    public AccountManagementService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {

        this.adminUserRepository =
                adminUserRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    // =========================================================
    // CREATE ACCOUNT MANAGER
    // =========================================================
    //
    // This operation is intentionally limited to the service
    // layer. The controller will enforce SUPER_ADMIN access.
    //
    // Newly created ACCOUNT_MANAGER:
    //
    // approved = false
    // enabled  = false
    //
    // Super Admin must explicitly approve the account.
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

        // =====================================================
        // VALIDATE USERNAME
        // =====================================================

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        // =====================================================
        // VALIDATE EMAIL
        // =====================================================

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        // =====================================================
        // VALIDATE PASSWORD
        // =====================================================

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

        // =====================================================
        // DUPLICATE USERNAME
        // =====================================================

        if (adminUserRepository
                .findByUsernameIgnoreCase(username)
                .isPresent()) {

            throw new IllegalStateException(
                    "Username is already registered."
            );
        }

        // =====================================================
        // DUPLICATE EMAIL
        // =====================================================

        if (adminUserRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            throw new IllegalStateException(
                    "Email is already registered."
            );
        }

        // =====================================================
        // CREATE ACCOUNT
        // =====================================================

        AdminUser accountManager =
                new AdminUser();

        accountManager.setUsername(
                username
        );

        accountManager.setEmail(
                email
        );

        // =====================================================
        // NEVER STORE PLAIN-TEXT PASSWORD
        // =====================================================

        accountManager.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        // =====================================================
        // FORCE ACCOUNT MANAGER ROLE
        // =====================================================

        accountManager.setRole(
                AdminRoles.ACCOUNT_MANAGER
        );

        // =====================================================
        // REQUIRE SUPER ADMIN APPROVAL
        // =====================================================

        accountManager.setApproved(
                false
        );

        accountManager.setApprovedBy(
                null
        );

        accountManager.setApprovedAt(
                null
        );

        // =====================================================
        // DISABLED UNTIL APPROVED
        // =====================================================

        accountManager.setEnabled(
                false
        );

        // =====================================================
        // SAVE
        // =====================================================

        return adminUserRepository.save(
                accountManager
        );
    }

    // =========================================================
    // GET MANAGEABLE USER ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public java.util.List<AdminUser>
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
    //
    // ACCOUNT_MANAGER may create:
    //     ADMIN
    //     EMPLOYEE
    //
    // ACCOUNT_MANAGER may NEVER create:
    //     SUPER_ADMIN
    //     ACCOUNT_MANAGER
    //
    // Newly created accounts require Super Admin approval.
    //
    // approved = false
    // enabled  = false
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

        // =====================================================
        // NORMALIZE ROLE
        // =====================================================

        String requestedRole =
                role == null
                        ? ""
                        : role.trim();

        // =====================================================
        // ROLE VALIDATION
        // =====================================================

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

        // =====================================================
        // USERNAME
        // =====================================================

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        // =====================================================
        // EMAIL
        // =====================================================

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        // =====================================================
        // PASSWORD
        // =====================================================

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

        // =====================================================
        // DUPLICATE USERNAME
        // =====================================================

        if (adminUserRepository
                .findByUsernameIgnoreCase(username)
                .isPresent()) {

            throw new IllegalStateException(
                    "Username is already registered."
            );
        }

        // =====================================================
        // DUPLICATE EMAIL
        // =====================================================

        if (adminUserRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            throw new IllegalStateException(
                    "Email is already registered."
            );
        }

        // =====================================================
        // CREATE USER
        // =====================================================

        AdminUser user =
                new AdminUser();

        user.setUsername(
                username
        );

        user.setEmail(
                email
        );

        // =====================================================
        // NEVER STORE PLAIN-TEXT PASSWORD
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        // =====================================================
        // SAFE ROLE
        // =====================================================

        user.setRole(
                requestedRole.toUpperCase()
        );

        // =====================================================
        // SUPER ADMIN APPROVAL REQUIRED
        // =====================================================

        user.setApproved(
                false
        );

        user.setApprovedBy(
                null
        );

        user.setApprovedAt(
                null
        );

        // =====================================================
        // DISABLED UNTIL APPROVED
        // =====================================================

        user.setEnabled(
                false
        );

        // =====================================================
        // SAVE
        // =====================================================

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // UPDATE MANAGEABLE USER ACCOUNT
    // =========================================================
    //
    // Account Manager can update:
    //     username
    //     email
    //
    // Account Manager CANNOT change:
    //     role
    //     password
    //     approved
    //     enabled
    //     permissions
    //
    // SUPER_ADMIN accounts are never manageable here.
    // The current Account Manager cannot modify itself.
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

        // =====================================================
        // CURRENT USER
        // =====================================================

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        // =====================================================
        // FIND TARGET
        // =====================================================

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        // =====================================================
        // DELETED ACCOUNT PROTECTION
        // =====================================================

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be modified."
            );
        }

        // =====================================================
        // NEVER MODIFY SUPER ADMIN
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be modified through Account Management."
            );
        }

        // =====================================================
        // PREVENT SELF-MODIFICATION
        // =====================================================

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot modify your own account."
            );
        }

        // =====================================================
        // USERNAME
        // =====================================================

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        // =====================================================
        // EMAIL
        // =====================================================

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        // =====================================================
        // DUPLICATE USERNAME
        // =====================================================

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

        // =====================================================
        // DUPLICATE EMAIL
        // =====================================================

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

        // =====================================================
        // UPDATE ONLY PROFILE FIELDS
        // =====================================================

        user.setUsername(
                username
        );

        user.setEmail(
                email
        );

        // =====================================================
        // IMPORTANT:
        // Do NOT modify:
        //
        // password
        // role
        // approved
        // approvedBy
        // approvedAt
        // enabled
        // permissions
        // =====================================================

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // DISABLE USER ACCOUNT
    // =========================================================
    //
    // Account Manager requires:
    //     ACCOUNT_USERS_DISABLE
    //
    // Cannot disable:
    //     - itself
    //     - SUPER_ADMIN
    //     - deleted account
    //
    // Approval state is preserved.
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

        // =====================================================
        // DELETED ACCOUNT PROTECTION
        // =====================================================

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is already deleted."
            );
        }

        // =====================================================
        // NEVER DISABLE SUPER ADMIN
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be disabled through Account Management."
            );
        }

        // =====================================================
        // PREVENT SELF-DISABLE
        // =====================================================

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot disable your own account."
            );
        }

        // =====================================================
        // DISABLE
        // =====================================================

        user.setEnabled(false);

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // ENABLE USER ACCOUNT
    // =========================================================
    //
    // Account Manager requires:
    //     ACCOUNT_USERS_ENABLE
    //
    // Cannot enable:
    //     - SUPER_ADMIN
    //     - deleted account
    //
    // An account MUST be approved before enabling.
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

        // =====================================================
        // DELETED ACCOUNT PROTECTION
        // =====================================================

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be enabled."
            );
        }

        // =====================================================
        // NEVER ENABLE SUPER ADMIN
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be enabled through Account Management."
            );
        }

        // =====================================================
        // APPROVAL REQUIRED
        // =====================================================

        if (!user.isApproved()) {

            throw new IllegalStateException(
                    "Account must be approved before it can be enabled."
            );
        }

        // =====================================================
        // ENABLE
        // =====================================================

        user.setEnabled(true);

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // CHANGE USER PASSWORD
    // =========================================================
    //
    // Account Manager requires:
    //     ACCOUNT_USERS_PASSWORD
    //
    // Cannot change:
    //     - itself
    //     - SUPER_ADMIN
    //     - deleted account
    //
    // Only the password is changed.
    // approved/enabled/role remain untouched.
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

        // =====================================================
        // VALIDATE PASSWORD
        // =====================================================

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

        // =====================================================
        // FIND TARGET ACCOUNT
        // =====================================================

        AdminUser user =
                adminUserRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User account not found."
                                )
                        );

        // =====================================================
        // DELETED ACCOUNT PROTECTION
        // =====================================================

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "Deleted user accounts cannot be modified."
            );
        }

        // =====================================================
        // NEVER MODIFY SUPER ADMIN
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN passwords cannot be changed through Account Management."
            );
        }

        // =====================================================
        // PREVENT SELF PASSWORD CHANGE
        // =====================================================

        if (user.getUsername() != null &&
                user.getUsername()
                        .equalsIgnoreCase(currentUser)) {

            throw new IllegalStateException(
                    "You cannot change your own password through Account Management."
            );
        }

        // =====================================================
        // UPDATE PASSWORD
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        // =====================================================
        // SAVE
        // =====================================================

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // SOFT DELETE USER ACCOUNT
    // =========================================================
    //
    // Account Manager requires:
    //     ACCOUNT_USERS_DELETE
    //
    // Cannot delete:
    //     - itself
    //     - SUPER_ADMIN
    //     - already deleted account
    //
    // Physical database row is preserved.
    // =========================================================

    @Transactional
    public AdminUser deleteUserAccount(
            Long userId,
            String currentUsername) {

        String currentUser =
                currentUsername == null
                        ? ""
                        : currentUsername.trim();

        // =====================================================
        // FIND TARGET
        // =====================================================

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
        // SOFT DELETE
        // =====================================================

        user.setDeleted(true);

        // Deleted accounts must not remain enabled.
        user.setEnabled(false);

        // =====================================================
        // SAVE
        // =====================================================

        return adminUserRepository.save(
                user
        );
    }

    // =========================================================
    // RESTORE USER ACCOUNT
    // =========================================================
    //
    // Restore does NOT automatically approve the account.
    //
    // deleted = false
    // enabled = false
    //
    // Super Admin approval is required before enabling.
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

        // =====================================================
        // SUPER ADMIN PROTECTION
        // =====================================================

        if (AdminRoles.SUPER_ADMIN.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be restored through Account Management."
            );
        }

        // =====================================================
        // ALREADY ACTIVE
        // =====================================================

        if (!user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is not deleted."
            );
        }

        // =====================================================
        // RESTORE
        // =====================================================

        user.setDeleted(false);

        // Important:
        // restored accounts remain disabled until
        // explicitly enabled after approval.
        user.setEnabled(false);

        return adminUserRepository.save(
                user
        );
    }
}