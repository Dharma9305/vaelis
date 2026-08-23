package vaelis_api.controller;

import vaelis_api.dto.AdminUserResponse;
import vaelis_api.entity.AdminUser;
import vaelis_api.service.AdminApprovalService;
import vaelis_api.service.AccountManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "http://localhost:3000")
public class SuperAdminController {

    private final AdminApprovalService
            adminApprovalService;
   
    private final AccountManagementService
        accountManagementService;
    
    

   public SuperAdminController(
        AdminApprovalService adminApprovalService,
        AccountManagementService accountManagementService) {

    this.adminApprovalService =
            adminApprovalService;

    this.accountManagementService =
            accountManagementService;
}

    // =========================================================
    // PENDING ADMIN ACCOUNTS
    // =========================================================

    @GetMapping("/admins/pending")
    public ResponseEntity<?> getPendingAdmins(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view pending Admin accounts."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getPendingAdmins()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVED ADMIN ACCOUNTS
    // =========================================================

    @GetMapping("/admins")
    public ResponseEntity<?> getApprovedAdmins(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view Admin accounts."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getApprovedAdmins()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVE ADMIN
    // =========================================================

    @PostMapping("/admins/{adminUserId}/approve")
    public ResponseEntity<?> approveAdmin(
            @PathVariable Long adminUserId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can approve Admin accounts."
            );
        }

        try {

            AdminUser approvedAdmin =
                    adminApprovalService
                            .approveAdmin(
                                    adminUserId,
                                    authentication.getName()
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            approvedAdmin
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // REJECT ADMIN
    // =========================================================

    @PostMapping("/admins/{adminUserId}/reject")
    public ResponseEntity<?> rejectAdmin(
            @PathVariable Long adminUserId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can reject Admin accounts."
            );
        }

        try {

            AdminUser rejectedAdmin =
                    adminApprovalService
                            .rejectAdmin(
                                    adminUserId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            rejectedAdmin
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // DISABLE ADMIN
    // =========================================================

    @PostMapping("/admins/{adminUserId}/disable")
    public ResponseEntity<?> disableAdmin(
            @PathVariable Long adminUserId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can disable Admin accounts."
            );
        }

        try {

            AdminUser disabledAdmin =
                    adminApprovalService
                            .disableAdmin(
                                    adminUserId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            disabledAdmin
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ENABLE ADMIN
    // =========================================================

    @PostMapping("/admins/{adminUserId}/enable")
    public ResponseEntity<?> enableAdmin(
            @PathVariable Long adminUserId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can enable Admin accounts."
            );
        }

        try {

            AdminUser enabledAdmin =
                    adminApprovalService
                            .enableAdmin(
                                    adminUserId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            enabledAdmin
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // PENDING ACCOUNT MANAGERS
    // =========================================================

    @GetMapping("/account-managers/pending")
    public ResponseEntity<?> getPendingAccountManagers(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view pending Account Managers."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getPendingAccountManagers()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVED ACCOUNT MANAGERS
    // =========================================================

    @GetMapping("/account-managers")
    public ResponseEntity<?> getApprovedAccountManagers(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view Account Managers."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getApprovedAccountManagers()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVE ACCOUNT MANAGER
    // =========================================================

    @PostMapping(
            "/account-managers/{accountManagerId}/approve"
    )
    public ResponseEntity<?> approveAccountManager(
            @PathVariable Long accountManagerId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can approve Account Managers."
            );
        }

        try {

            AdminUser approvedAccountManager =
                    adminApprovalService
                            .approveAccountManager(
                                    accountManagerId,
                                    authentication.getName()
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            approvedAccountManager
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // REJECT ACCOUNT MANAGER
    // =========================================================

    @PostMapping(
            "/account-managers/{accountManagerId}/reject"
    )
    public ResponseEntity<?> rejectAccountManager(
            @PathVariable Long accountManagerId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can reject Account Managers."
            );
        }

        try {

            AdminUser rejectedAccountManager =
                    adminApprovalService
                            .rejectAccountManager(
                                    accountManagerId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            rejectedAccountManager
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // DISABLE ACCOUNT MANAGER
    // =========================================================

    @PostMapping(
            "/account-managers/{accountManagerId}/disable"
    )
    public ResponseEntity<?> disableAccountManager(
            @PathVariable Long accountManagerId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can disable Account Managers."
            );
        }

        try {

            AdminUser disabledAccountManager =
                    adminApprovalService
                            .disableAccountManager(
                                    accountManagerId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            disabledAccountManager
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ENABLE ACCOUNT MANAGER
    // =========================================================

    @PostMapping(
            "/account-managers/{accountManagerId}/enable"
    )
    public ResponseEntity<?> enableAccountManager(
            @PathVariable Long accountManagerId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can enable Account Managers."
            );
        }

        try {

            AdminUser enabledAccountManager =
                    adminApprovalService
                            .enableAccountManager(
                                    accountManagerId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            enabledAccountManager
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // PENDING EMPLOYEES
    // =========================================================

    @GetMapping("/employees/pending")
    public ResponseEntity<?> getPendingEmployees(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view pending Employees."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getPendingEmployees()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVED EMPLOYEES
    // =========================================================

    @GetMapping("/employees")
    public ResponseEntity<?> getApprovedEmployees(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view Employees."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getApprovedEmployees()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // APPROVE EMPLOYEE
    // =========================================================

    @PostMapping("/employees/{employeeId}/approve")
    public ResponseEntity<?> approveEmployee(
            @PathVariable Long employeeId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can approve Employees."
            );
        }

        try {

            AdminUser approvedEmployee =
                    adminApprovalService
                            .approveEmployee(
                                    employeeId,
                                    authentication.getName()
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            approvedEmployee
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // REJECT EMPLOYEE
    // =========================================================

    @PostMapping("/employees/{employeeId}/reject")
    public ResponseEntity<?> rejectEmployee(
            @PathVariable Long employeeId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can reject Employees."
            );
        }

        try {

            AdminUser rejectedEmployee =
                    adminApprovalService
                            .rejectEmployee(
                                    employeeId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            rejectedEmployee
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // DISABLE EMPLOYEE
    // =========================================================

    @PostMapping("/employees/{employeeId}/disable")
    public ResponseEntity<?> disableEmployee(
            @PathVariable Long employeeId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can disable Employees."
            );
        }

        try {

            AdminUser disabledEmployee =
                    adminApprovalService
                            .disableEmployee(
                                    employeeId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            disabledEmployee
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ENABLE EMPLOYEE
    // =========================================================

    @PostMapping("/employees/{employeeId}/enable")
    public ResponseEntity<?> enableEmployee(
            @PathVariable Long employeeId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can enable Employees."
            );
        }

        try {

            AdminUser enabledEmployee =
                    adminApprovalService
                            .enableEmployee(
                                    employeeId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            enabledEmployee
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    // =========================================================
    // DELETED USERS
    // =========================================================

    @GetMapping("/deleted-users")
    public ResponseEntity<?> getDeletedUsers(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view deleted users."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getDeletedUsers()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // DELETED EMPLOYEES
    // =========================================================

    @GetMapping("/deleted-users/employees")
    public ResponseEntity<?> getDeletedEmployees(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view deleted Employees."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getDeletedEmployees()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // DELETED ADMINS
    // =========================================================

    @GetMapping("/deleted-users/admins")
    public ResponseEntity<?> getDeletedAdmins(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view deleted Admin accounts."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getDeletedAdmins()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // DELETED ACCOUNT MANAGERS
    // =========================================================

    @GetMapping("/deleted-users/account-managers")
    public ResponseEntity<?> getDeletedAccountManagers(
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can view deleted Account Managers."
            );
        }

        return ResponseEntity.ok(
                adminApprovalService
                        .getDeletedAccountManagers()
                        .stream()
                        .map(AdminUserResponse::new)
                        .toList()
        );
    }

    // =========================================================
    // RESTORE DELETED USER
    // =========================================================
    //
    // IMPORTANT:
    // Restore only removes the soft-delete flag.
    //
    // deleted = false
    // enabled = false
    //
    // The account remains disabled until SUPER_ADMIN
    // explicitly enables it.
    // =========================================================

    @PostMapping("/users/{userId}/restore")
    public ResponseEntity<?> restoreDeletedUser(
            @PathVariable Long userId,
            Authentication authentication) {

        if (!isSuperAdmin(authentication)) {

            return forbidden(
                    "Only SUPER_ADMIN can restore deleted users."
            );
        }

        try {

            AdminUser restoredUser =
                    adminApprovalService
                            .restoreDeletedUser(
                                    userId
                            );

            return ResponseEntity.ok(
                    new AdminUserResponse(
                            restoredUser
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    // =========================================================
// PENDING DELETION REQUESTS
// =========================================================

@GetMapping("/deletion-requests")
public ResponseEntity<?> getDeletionRequests(
        Authentication authentication) {

    if (!isSuperAdmin(authentication)) {

        return forbidden(
                "Only SUPER_ADMIN can view deletion requests."
        );
    }

    return ResponseEntity.ok(
            accountManagementService
                    .getPendingDeletionRequests()
                    .stream()
                    .map(AdminUserResponse::new)
                    .toList()
    );
}

// =========================================================
// APPROVE DELETION REQUEST
// =========================================================

@PostMapping(
        "/deletion-requests/{userId}/approve"
)
public ResponseEntity<?> approveDeletionRequest(
        @PathVariable Long userId,
        Authentication authentication) {

    if (!isSuperAdmin(authentication)) {

        return forbidden(
                "Only SUPER_ADMIN can approve deletion requests."
        );
    }

    try {

        AdminUser deletedUser =
                accountManagementService
                        .approveDeletionRequest(
                                userId,
                                authentication.getName()
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        deletedUser
                )
        );

    } catch (IllegalArgumentException |
             IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}

// =========================================================
// REJECT DELETION REQUEST
// =========================================================

@PostMapping(
        "/deletion-requests/{userId}/reject"
)
public ResponseEntity<?> rejectDeletionRequest(
        @PathVariable Long userId,
        @RequestParam String reason,
        Authentication authentication) {

    if (!isSuperAdmin(authentication)) {

        return forbidden(
                "Only SUPER_ADMIN can reject deletion requests."
        );
    }

    try {

        AdminUser restoredUser =
                accountManagementService
                        .rejectDeletionRequest(
                                userId,
                                authentication.getName(),
                                reason
                        );

        return ResponseEntity.ok(
                new AdminUserResponse(
                        restoredUser
                )
        );

    } catch (IllegalArgumentException |
             IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
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
    
    // =========================================================
    // FORBIDDEN RESPONSE
    // =========================================================

    private ResponseEntity<?> forbidden(
            String message) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(message);
    }
    
}