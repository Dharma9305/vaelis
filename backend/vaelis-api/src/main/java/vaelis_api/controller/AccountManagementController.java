package vaelis_api.controller;
import vaelis_api.service.AdminPermissionService;
import vaelis_api.entity.AdminPermission;
import vaelis_api.dto.AdminRegistrationRequest;
import vaelis_api.dto.AdminUserResponse;
import vaelis_api.dto.PasswordChangeRequest;
import vaelis_api.entity.AdminUser;
import vaelis_api.service.AccountManagementService;
import vaelis_api.service.AdminAuthorizationService;
import vaelis_api.service.AdminPermissionDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account-management")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountManagementController {

    private final AccountManagementService
            accountManagementService;

    private final AdminAuthorizationService
            adminAuthorizationService;
    
    private final AdminPermissionService adminPermissionService;

    public AccountManagementController(
        AccountManagementService accountManagementService,
        AdminAuthorizationService adminAuthorizationService,
        AdminPermissionService adminPermissionService) {

    this.accountManagementService =
            accountManagementService;

    this.adminAuthorizationService =
            adminAuthorizationService;

    this.adminPermissionService =
            adminPermissionService;
}

    // =========================================================
    // VIEW MANAGEABLE USER ACCOUNTS
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            Authentication authentication) {

        try {

            adminAuthorizationService
                    .requirePermission(
                            authentication,
                            "ACCOUNT_USERS_VIEW"
                    );

            List<AdminUser> users =
                    accountManagementService
                            .getManageableUsers(
                                    authentication.getName()
                            );

            return ResponseEntity.ok(
                    users
                            .stream()
                            .map(AdminUserResponse::new)
                            .toList()
            );

        } catch (
                AdminPermissionDeniedException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

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
    // CREATE USER ACCOUNT
    // =========================================================

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestBody AdminRegistrationRequest request,
            @RequestParam String role,
            Authentication authentication) {

        try {

            // =================================================
            // PERMISSION CHECK
            // =================================================

            adminAuthorizationService
                    .requirePermission(
                            authentication,
                            "ACCOUNT_USERS_CREATE"
                    );

            // =================================================
            // CREATE ACCOUNT
            // =================================================

            AdminUser createdUser =
                    accountManagementService
                            .createUserAccount(
                                    request,
                                    role
                            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            new AdminUserResponse(
                                    createdUser
                            )
                    );

        } catch (
                AdminPermissionDeniedException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (
                IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (
                IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Unable to create account."
                            )
                    );
        }
    }
    // =========================================================
// UPDATE USER ACCOUNT
// =========================================================

@PutMapping("/users/{userId}")
public ResponseEntity<?> updateUser(
        @PathVariable Long userId,
        @RequestBody AdminRegistrationRequest request,
        Authentication authentication) {

    try {

        // =================================================
        // PERMISSION CHECK
        // =================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_UPDATE"
                );

        // =================================================
        // UPDATE ACCOUNT
        // =================================================

        AdminUser updatedUser =
                accountManagementService
                        .updateUserAccount(
                                userId,
                                request,
                                authentication.getName()
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        updatedUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to update account."
                );
    }
}
// =========================================================
// DISABLE USER ACCOUNT
// =========================================================

@PostMapping("/users/{userId}/disable")
public ResponseEntity<?> disableUser(
        @PathVariable Long userId,
        Authentication authentication) {

    try {

        // =================================================
        // PERMISSION CHECK
        // =================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_DISABLE"
                );

        // =================================================
        // DISABLE
        // =================================================

        AdminUser disabledUser =
                accountManagementService
                        .disableUserAccount(
                                userId,
                                authentication.getName()
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        disabledUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to disable account."
                );
    }
}


// =========================================================
// ENABLE USER ACCOUNT
// =========================================================

@PostMapping("/users/{userId}/enable")
public ResponseEntity<?> enableUser(
        @PathVariable Long userId,
        Authentication authentication) {

    try {

        // =================================================
        // PERMISSION CHECK
        // =================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_ENABLE"
                );

        // =================================================
        // ENABLE
        // =================================================

        AdminUser enabledUser =
                accountManagementService
                        .enableUserAccount(
                                userId
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        enabledUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to enable account."
                );
    }
}
// =========================================================
// CHANGE USER PASSWORD
// =========================================================

@PostMapping("/users/{userId}/password")
public ResponseEntity<?> changeUserPassword(
        @PathVariable Long userId,
        @RequestBody PasswordChangeRequest request,
        Authentication authentication) {

    try {

        // =================================================
        // PERMISSION CHECK
        // =================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_PASSWORD"
                );

        // =================================================
        // REQUEST VALIDATION
        // =================================================

        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password request is required."
                    );
        }

        // =================================================
        // CHANGE PASSWORD
        // =================================================

        AdminUser updatedUser =
                accountManagementService
                        .changeUserPassword(
                                userId,
                                request.getPassword(),
                                authentication.getName()
                        );

        // =================================================
        // NEVER RETURN PASSWORD
        // =================================================

        return ResponseEntity.ok(
                new AdminUserResponse(
                        updatedUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to change account password."
                );
    }
}
// =========================================================
// SOFT DELETE USER ACCOUNT
// =========================================================

@DeleteMapping("/users/{userId}")
public ResponseEntity<?> deleteUser(
        @PathVariable Long userId,
        Authentication authentication) {

    try {

        // =================================================
        // PERMISSION CHECK
        // =================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_DELETE"
                );

        // =================================================
        // SOFT DELETE
        // =================================================

        AdminUser deletedUser =
                accountManagementService
                        .deleteUserAccount(
                                userId,
                                authentication.getName()
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        deletedUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to delete account."
                );
    }
}
// =========================================================
// MANAGE USER PERMISSIONS
// =========================================================
//
// Account Manager requires:
//     ACCOUNT_USERS_PERMISSIONS
//
// Adds one permission to a manageable ADMIN / ACCOUNT_MANAGER.
// The existing AdminPermissionService performs the target-role
// and permission validation.
// =========================================================

@PostMapping("/users/{userId}/permissions/{permissionId}")
public ResponseEntity<?> addUserPermission(
        @PathVariable Long userId,
        @PathVariable Long permissionId,
        Authentication authentication) {

    try {

        // =====================================================
        // PERMISSION CHECK
        // =====================================================

        adminAuthorizationService
                .requirePermission(
                        authentication,
                        "ACCOUNT_USERS_PERMISSIONS"
                );

        // =====================================================
        // ADD PERMISSION
        // =====================================================

        AdminUser updatedUser =
                adminPermissionService
                        .addPermission(
                                userId,
                                permissionId
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        updatedUser
                )
        );

    } catch (
            AdminPermissionDeniedException e) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());

    } catch (
            IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (
            IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        "Unable to add user permission."
                );
    }
}
}