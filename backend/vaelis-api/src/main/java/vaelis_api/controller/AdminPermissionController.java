package vaelis_api.controller;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.service.AdminPermissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminPermissionController {

    private final AdminUserRepository adminUserRepository;

    private final AdminPermissionService
            adminPermissionService;

    public AdminPermissionController(
            AdminUserRepository adminUserRepository,
            AdminPermissionService adminPermissionService) {

        this.adminUserRepository =
                adminUserRepository;

        this.adminPermissionService =
                adminPermissionService;
    }

    // =========================================================
    // GET CURRENT ADMIN PERMISSIONS
    // =========================================================

    @GetMapping("/permissions")
    public ResponseEntity<?> getCurrentAdminPermissions(
            Authentication authentication) {

        // =====================================================
        // AUTHENTICATION CHECK
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Not authenticated."
                    );
        }

        // =====================================================
        // CURRENT USERNAME
        // =====================================================

        String username =
                authentication.getName();

        // =====================================================
        // FIND ADMIN
        // =====================================================

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                username.trim()
                        )
                        .orElse(null);

        if (adminUser == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Admin account not found."
                    );
        }

        // =====================================================
        // ONLY ADMIN ACCOUNTS
        // =====================================================

        if (!"ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Only ADMIN accounts can access this endpoint."
                    );
        }

        // =====================================================
        // GET ASSIGNED PERMISSIONS
        // =====================================================

        Set<AdminPermission> permissions =
                adminPermissionService
                        .getAdminPermissions(
                                adminUser.getId()
                        );

        // =====================================================
        // RETURN PERMISSIONS
        // =====================================================

        return ResponseEntity.ok(
                permissions
                        .stream()
                        .filter(
                                AdminPermission::isEnabled
                        )
                        .toList()
        );
    }
}