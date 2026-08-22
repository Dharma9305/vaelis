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

    @Transactional(readOnly = true)
    public boolean hasPermission(
            Authentication authentication,
            String permissionCode) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        if (permissionCode == null ||
                permissionCode.isBlank()) {

            return false;
        }

        String username =
                authentication.getName();

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
        // SUPER ADMIN
        // =====================================================

        // SUPER_ADMIN has complete system authority.
        // This bypass is intentional.
        if ("SUPER_ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            return adminUser.isApproved() &&
                    adminUser.isEnabled();
        }

        // =====================================================
        // SUPPORTED PERMISSION-BASED ROLES
        // =====================================================

        boolean supportedRole =
                "ADMIN".equalsIgnoreCase(
                        adminUser.getRole()
                ) ||
                "ACCOUNT_MANAGER".equalsIgnoreCase(
                        adminUser.getRole()
                );

        if (!supportedRole) {
            return false;
        }

        // =====================================================
        // APPROVAL / ENABLED CHECK
        // =====================================================

        if (!adminUser.isApproved() ||
                !adminUser.isEnabled()) {

            return false;
        }

        // =====================================================
        // PERMISSION CHECK
        // =====================================================

        if (adminUser.getPermissions() == null) {
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

    if (!"SUPER_ADMIN".equalsIgnoreCase(
            adminUser.getRole()
    )) {

        throw new SecurityException(
                "Only SUPER_ADMIN can perform this operation."
        );
    }
}
}