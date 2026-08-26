package vaelis_api.service;

import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAuthorizationService {

    private final AdminUserRepository adminUserRepository;

    public AdminAuthorizationService(
            AdminUserRepository adminUserRepository) {

        this.adminUserRepository =
                adminUserRepository;
    }

    // =========================================================
    // CHECK CURRENT USER PERMISSION
    // =========================================================
    //
    // Permission-based authorization is determined by the
    // permissions assigned to the authenticated AdminUser.
    //
    // IMPORTANT:
    // EMPLOYEE users may also have explicitly granted
    // administrative permissions through the permission
    // request workflow.
    // =========================================================

    @Transactional(readOnly = true)
    public boolean hasPermission(
            Authentication authentication,
            String permissionCode) {

        // =====================================================
        // BASIC VALIDATION
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        if (permissionCode == null ||
                permissionCode.isBlank()) {

            return false;
        }

        // =====================================================
        // FIND CURRENT USER
        // =====================================================

        String username =
                authentication.getName();

        if (username == null ||
                username.isBlank()) {

            return false;
        }

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                username.trim()
                        )
                        .orElse(null);

        if (adminUser == null) {

            return false;
        }

        // =====================================================
        // ACCOUNT STATE
        // =====================================================

        if (!adminUser.isApproved() ||
                !adminUser.isEnabled() ||
                adminUser.isDeleted()) {

            return false;
        }

        // =====================================================
        // SUPER ADMIN
        // =====================================================
        //
        // SUPER_ADMIN has complete system authority.
        //
        // This bypass is intentional.
        // =====================================================

        if ("SUPER_ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            return true;
        }

        // =====================================================
        // PERMISSION CHECK
        // =====================================================
        //
        // Do NOT restrict this by role.
        //
        // An EMPLOYEE can receive an administrative
        // permission through the approved permission-request
        // workflow.
        // =====================================================

        if (adminUser.getPermissions() == null ||
                adminUser.getPermissions().isEmpty()) {

            return false;
        }

        return adminUser
                .getPermissions()
                .stream()
                .filter(permission ->
                        permission != null &&
                        permission.isEnabled()
                )
                .anyMatch(permission ->
                        permissionCode.equalsIgnoreCase(
                                permission.getCode()
                        )
                );
    }

    // =========================================================
    // REQUIRE PERMISSION
    // =========================================================

    public void requirePermission(
            Authentication authentication,
            String permissionCode) {

        if (!hasPermission(
                authentication,
                permissionCode
        )) {

            throw new AdminPermissionDeniedException(
                    "Permission required: "
                            + permissionCode
            );
        }
    }

    // =========================================================
    // REQUIRE SUPER ADMIN
    // =========================================================

    @Transactional(readOnly = true)
    public void requireSuperAdmin(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "Authentication is required."
            );
        }

        String username =
                authentication.getName();

        if (username == null ||
                username.isBlank()) {

            throw new SecurityException(
                    "Authentication username is missing."
            );
        }

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                username.trim()
                        )
                        .orElse(null);

        if (adminUser == null) {

            throw new SecurityException(
                    "Account not found."
            );
        }

        if (!adminUser.isApproved() ||
                !adminUser.isEnabled() ||
                adminUser.isDeleted()) {

            throw new SecurityException(
                    "Account is not active."
            );
        }

        if (!"SUPER_ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            throw new SecurityException(
                    "Only SUPER_ADMIN can perform this operation."
            );
        }
    }
}