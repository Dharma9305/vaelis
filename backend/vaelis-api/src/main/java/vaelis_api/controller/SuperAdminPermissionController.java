package vaelis_api.controller;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminUser;
import vaelis_api.service.AdminPermissionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/super-admin/permissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SuperAdminPermissionController {

    private final AdminPermissionService
            adminPermissionService;

    public SuperAdminPermissionController(
            AdminPermissionService adminPermissionService) {

        this.adminPermissionService =
                adminPermissionService;
    }

    // =========================================================
    // GET ALL AVAILABLE PERMISSIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllPermissions(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden();
        }

        try {

            List<AdminPermission> permissions =
                    adminPermissionService
                            .getAllPermissions();

            return ResponseEntity.ok(
                    permissions
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================================
    // GET PERMISSIONS FOR ADMIN
    // =========================================================

    @GetMapping("/admins/{adminUserId}")
    public ResponseEntity<?> getAdminPermissions(
            @PathVariable Long adminUserId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden();
        }

        try {

            Set<AdminPermission> permissions =
                    adminPermissionService
                            .getAdminPermissions(
                                    adminUserId
                            );

            return ResponseEntity.ok(
                    permissions
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================================
    // ASSIGN / REPLACE ALL PERMISSIONS
    // =========================================================

    @PutMapping("/admins/{adminUserId}")
    public ResponseEntity<?> assignPermissions(
            @PathVariable Long adminUserId,
            @RequestBody Set<Long> permissionIds,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden();
        }

        try {

            AdminUser adminUser =
                    adminPermissionService
                            .assignPermissions(
                                    adminUserId,
                                    permissionIds
                            );

            return ResponseEntity.ok(
                    adminUser.getPermissions()
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================================
    // ADD SINGLE PERMISSION
    // =========================================================

    @PostMapping(
            "/admins/{adminUserId}/{permissionId}"
    )
    public ResponseEntity<?> addPermission(
            @PathVariable Long adminUserId,
            @PathVariable Long permissionId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden();
        }

        try {

            AdminUser adminUser =
                    adminPermissionService
                            .addPermission(
                                    adminUserId,
                                    permissionId
                            );

            return ResponseEntity.ok(
                    adminUser.getPermissions()
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================================
    // REMOVE SINGLE PERMISSION
    // =========================================================

    @DeleteMapping(
            "/admins/{adminUserId}/{permissionId}"
    )
    public ResponseEntity<?> removePermission(
            @PathVariable Long adminUserId,
            @PathVariable Long permissionId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden();
        }

        try {

            AdminUser adminUser =
                    adminPermissionService
                            .removePermission(
                                    adminUserId,
                                    permissionId
                            );

            return ResponseEntity.ok(
                    adminUser.getPermissions()
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }

    // =========================================================
    // FORBIDDEN
    // =========================================================

    private ResponseEntity<?> forbidden() {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Only SUPER_ADMIN can manage permissions."
                );
    }

    // =========================================================
    // SUPER ADMIN CHECK
    // =========================================================

    private boolean isSuperAdmin(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        Collection<? extends GrantedAuthority>
                authorities =
                        authentication.getAuthorities();

        return authorities.stream()
                .anyMatch(authority ->
                        "ROLE_SUPER_ADMIN".equals(
                                authority.getAuthority()
                        )
                );
    }
}