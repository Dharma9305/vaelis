package vaelis_api.service;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminPermissionRequest;
import vaelis_api.entity.AdminPermissionRequestStatus;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminPermissionRepository;
import vaelis_api.repository.AdminPermissionRequestRepository;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AdminPermissionRequestService {

    private final AdminPermissionRequestRepository requestRepository;

    private final AdminUserRepository adminUserRepository;

    private final AdminPermissionRepository permissionRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    public AdminPermissionRequestService(
            AdminPermissionRequestRepository requestRepository,
            AdminUserRepository adminUserRepository,
            AdminPermissionRepository permissionRepository,
            AdminActivityLogService adminActivityLogService) {

        this.requestRepository =
                requestRepository;

        this.adminUserRepository =
                adminUserRepository;

        this.permissionRepository =
                permissionRepository;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // CREATE PERMISSION REQUEST
    // =========================================================

    public AdminPermissionRequest createRequest(
            Long targetUserId,
            Long permissionId,
            String reason,
            Authentication authentication) {

        AdminUser requester =
                getAuthenticatedUser(authentication);

        AdminUser targetUser =
                getUser(targetUserId);

        AdminPermission permission =
                getPermission(permissionId);

        String requesterRole =
                normalizeRole(
                        requester.getRole()
                );

        // =====================================================
        // REQUESTER AUTHORIZATION
        // =====================================================

        if (!isRequestAllowed(requesterRole)) {

            throw new SecurityException(
                    "This role cannot request permissions."
            );
        }

        // =====================================================
        // TARGET VALIDATION
        // =====================================================

        if (targetUser.isDeleted()) {

            throw new IllegalStateException(
                    "Target account has been deleted."
            );
        }

        if (!targetUser.isApproved() ||
                !targetUser.isEnabled()) {

            throw new IllegalStateException(
                    "Target account must be approved and enabled."
            );
        }

        // =====================================================
        // PERMISSION VALIDATION
        // =====================================================

        if (!permission.isEnabled()) {

            throw new IllegalStateException(
                    "Permission is disabled."
            );
        }

        // =====================================================
        // ALREADY ASSIGNED
        // =====================================================

        boolean alreadyAssigned =
                targetUser.getPermissions() != null &&
                targetUser.getPermissions()
                        .stream()
                        .anyMatch(existing ->
                                existing != null &&
                                existing.isEnabled() &&
                                existing.getId()
                                        .equals(permissionId)
                        );

        if (alreadyAssigned) {

            throw new IllegalStateException(
                    "Permission is already assigned."
            );
        }

        // =====================================================
        // DUPLICATE ACTIVE REQUEST
        // =====================================================

        boolean duplicate =
                requestRepository
                        .existsByTargetUserIdAndPermissionIdAndStatus(
                                targetUserId,
                                permissionId,
                                AdminPermissionRequestStatus
                                        .PENDING_ACCOUNT_MANAGER
                        )
                ||
                requestRepository
                        .existsByTargetUserIdAndPermissionIdAndStatus(
                                targetUserId,
                                permissionId,
                                AdminPermissionRequestStatus
                                        .PENDING_SUPER_ADMIN
                        );

        if (duplicate) {

            throw new IllegalStateException(
                    "An active permission request already exists."
            );
        }

        // =====================================================
        // CREATE REQUEST
        // =====================================================

        AdminPermissionRequest request =
                new AdminPermissionRequest();

        request.setTargetUser(
                targetUser
        );

        request.setPermission(
                permission
        );

        request.setRequestedBy(
                requester
        );

        request.setRequestedByRole(
                requesterRole
        );

        request.setReason(
                reason
        );

        request.setStatus(
                AdminPermissionRequestStatus
                        .PENDING_ACCOUNT_MANAGER
        );

        AdminPermissionRequest saved =
                requestRepository.save(
                        request
                );

        // =====================================================
        // AUDIT LOG
        // =====================================================

        adminActivityLogService.log(
                "PERMISSION_REQUEST_CREATED",
                targetUser,
                "Permission request created. "
                        + "Permission="
                        + permission.getCode()
                        + ", requestedBy="
                        + requester.getUsername()
                        + ", requestedByRole="
                        + requesterRole,
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // ACCOUNT MANAGER APPROVAL
    // =========================================================

    public AdminPermissionRequest
    approveByAccountManager(
            Long requestId,
            String comment,
            Authentication authentication) {

        AdminUser reviewer =
                getAuthenticatedUser(authentication);

        requireRole(
                reviewer,
                "ACCOUNT_MANAGER"
        );

        AdminPermissionRequest request =
                getRequest(requestId);

        if (request.getStatus() !=
                AdminPermissionRequestStatus
                        .PENDING_ACCOUNT_MANAGER) {

            throw new IllegalStateException(
                    "Request is not awaiting Account Manager approval."
            );
        }

        request.setAccountManagerReviewer(
                reviewer
        );

        request.setAccountManagerReviewedAt(
                LocalDateTime.now()
        );

        request.setAccountManagerReviewComment(
                comment
        );

        request.setStatus(
                AdminPermissionRequestStatus
                        .PENDING_SUPER_ADMIN
        );

        AdminPermissionRequest saved =
                requestRepository.save(
                        request
                );

        adminActivityLogService.log(
                "PERMISSION_REQUEST_ACCOUNT_MANAGER_APPROVED",
                request.getTargetUser(),
                "Permission="
                        + request.getPermission().getCode()
                        + ", requestId="
                        + requestId,
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // ACCOUNT MANAGER REJECTION
    // =========================================================

    public AdminPermissionRequest
    rejectByAccountManager(
            Long requestId,
            String comment,
            Authentication authentication) {

        AdminUser reviewer =
                getAuthenticatedUser(authentication);

        requireRole(
                reviewer,
                "ACCOUNT_MANAGER"
        );

        AdminPermissionRequest request =
                getRequest(requestId);

        if (request.getStatus() !=
                AdminPermissionRequestStatus
                        .PENDING_ACCOUNT_MANAGER) {

            throw new IllegalStateException(
                    "Request is not awaiting Account Manager approval."
            );
        }

        request.setAccountManagerReviewer(
                reviewer
        );

        request.setAccountManagerReviewedAt(
                LocalDateTime.now()
        );

        request.setAccountManagerReviewComment(
                comment
        );

        request.setStatus(
                AdminPermissionRequestStatus
                        .REJECTED_BY_ACCOUNT_MANAGER
        );

        AdminPermissionRequest saved =
                requestRepository.save(
                        request
                );

        adminActivityLogService.log(
                "PERMISSION_REQUEST_ACCOUNT_MANAGER_REJECTED",
                request.getTargetUser(),
                "Permission="
                        + request.getPermission().getCode()
                        + ", requestId="
                        + requestId,
                "REJECTED"
        );

        return saved;
    }

    // =========================================================
    // SUPER ADMIN APPROVAL
    // =========================================================

    public AdminPermissionRequest
    approveBySuperAdmin(
            Long requestId,
            String comment,
            Authentication authentication) {

        AdminUser reviewer =
                getAuthenticatedUser(authentication);

        requireRole(
                reviewer,
                "SUPER_ADMIN"
        );

        AdminPermissionRequest request =
                getRequest(requestId);

        if (request.getStatus() !=
                AdminPermissionRequestStatus
                        .PENDING_SUPER_ADMIN) {

            throw new IllegalStateException(
                    "Request is not awaiting Super Admin approval."
            );
        }

        AdminUser targetUser =
                request.getTargetUser();

        AdminPermission permission =
                request.getPermission();

        // =====================================================
        // REVALIDATE BEFORE FINAL ASSIGNMENT
        // =====================================================

        if (targetUser.isDeleted() ||
                !targetUser.isApproved() ||
                !targetUser.isEnabled()) {

            throw new IllegalStateException(
                    "Target account is no longer eligible."
            );
        }

        if (!permission.isEnabled()) {

            throw new IllegalStateException(
                    "Permission is no longer enabled."
            );
        }

        // =====================================================
        // ASSIGN ACTUAL PERMISSION
        // =====================================================

        if (targetUser.getPermissions() == null) {

            throw new IllegalStateException(
                    "Target account permission collection is unavailable."
            );
        }

        boolean alreadyAssigned =
                targetUser.getPermissions()
                        .stream()
                        .anyMatch(existing ->
                                existing != null &&
                                existing.getId()
                                        .equals(permission.getId())
                        );

        if (!alreadyAssigned) {

            targetUser.getPermissions()
                    .add(permission);
        }

        adminUserRepository.save(
                targetUser
        );

        // =====================================================
        // RECORD SUPER ADMIN APPROVAL
        // =====================================================

        request.setSuperAdminReviewer(
                reviewer
        );

        request.setSuperAdminReviewedAt(
                LocalDateTime.now()
        );

        request.setSuperAdminReviewComment(
                comment
        );

        request.setStatus(
                AdminPermissionRequestStatus
                        .APPROVED
        );

        AdminPermissionRequest saved =
                requestRepository.save(
                        request
                );

        // =====================================================
        // AUDIT LOG
        // =====================================================

        adminActivityLogService.log(
                "PERMISSION_REQUEST_SUPER_ADMIN_APPROVED",
                targetUser,
                "Permission="
                        + permission.getCode()
                        + ", requestId="
                        + requestId
                        + ". Permission assigned.",
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // SUPER ADMIN REJECTION
    // =========================================================

    public AdminPermissionRequest
    rejectBySuperAdmin(
            Long requestId,
            String comment,
            Authentication authentication) {

        AdminUser reviewer =
                getAuthenticatedUser(authentication);

        requireRole(
                reviewer,
                "SUPER_ADMIN"
        );

        AdminPermissionRequest request =
                getRequest(requestId);

        if (request.getStatus() !=
                AdminPermissionRequestStatus
                        .PENDING_SUPER_ADMIN) {

            throw new IllegalStateException(
                    "Request is not awaiting Super Admin approval."
            );
        }

        request.setSuperAdminReviewer(
                reviewer
        );

        request.setSuperAdminReviewedAt(
                LocalDateTime.now()
        );

        request.setSuperAdminReviewComment(
                comment
        );

        request.setStatus(
                AdminPermissionRequestStatus
                        .REJECTED_BY_SUPER_ADMIN
        );

        AdminPermissionRequest saved =
                requestRepository.save(
                        request
                );

        adminActivityLogService.log(
                "PERMISSION_REQUEST_SUPER_ADMIN_REJECTED",
                request.getTargetUser(),
                "Permission="
                        + request.getPermission().getCode()
                        + ", requestId="
                        + requestId,
                "REJECTED"
        );

        return saved;
    }

    // =========================================================
    // GET REQUEST
    // =========================================================

    @Transactional(readOnly = true)
    public AdminPermissionRequest
    getRequest(Long requestId) {

        return requestRepository
                .findById(requestId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Permission request not found."
                        )
                );
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminPermissionRequest>
    getAllRequests() {

        return requestRepository
                .findAllByOrderByCreatedAtDesc();
    }

    // =========================================================
    // GET BY TARGET USER
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminPermissionRequest>
    getRequestsForUser(
            Long targetUserId) {

        return requestRepository
                .findByTargetUserIdOrderByCreatedAtDesc(
                        targetUserId
                );
    }

    // =========================================================
    // GET BY STATUS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminPermissionRequest>
    getRequestsByStatus(
            AdminPermissionRequestStatus status) {

        return requestRepository
                .findByStatusOrderByCreatedAtDesc(
                        status
                );
    }

    // =========================================================
    // AUTHENTICATED USER
    // =========================================================

    private AdminUser getAuthenticatedUser(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "Authentication is required."
            );
        }

        return adminUserRepository
                .findByUsernameIgnoreCase(
                        authentication
                                .getName()
                                .trim()
                )
                .orElseThrow(() ->
                        new SecurityException(
                                "Authenticated account not found."
                        )
                );
    }

    // =========================================================
    // USER
    // =========================================================

    private AdminUser getUser(
            Long userId) {

        return adminUserRepository
                .findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User account not found."
                        )
                );
    }

    // =========================================================
    // PERMISSION
    // =========================================================

    private AdminPermission getPermission(
            Long permissionId) {

        return permissionRepository
                .findById(permissionId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Permission not found."
                        )
                );
    }

    // =========================================================
    // ROLE CHECK
    // =========================================================

    private void requireRole(
            AdminUser user,
            String expectedRole) {

        if (!expectedRole.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new SecurityException(
                    "Only "
                            + expectedRole
                            + " can perform this operation."
            );
        }

        if (user.isDeleted() ||
                !user.isApproved() ||
                !user.isEnabled()) {

            throw new SecurityException(
                    "Account is not active."
            );
        }
    }

    // =========================================================
    // REQUESTER ROLE
    // =========================================================

    private boolean isRequestAllowed(
            String role) {

        return
                "ADMIN".equalsIgnoreCase(role) ||
                "EMPLOYEE".equalsIgnoreCase(role) ||
                "ACCOUNT_MANAGER".equalsIgnoreCase(role) ||
                "SUPER_ADMIN".equalsIgnoreCase(role);
    }

    // =========================================================
    // NORMALIZE ROLE
    // =========================================================

    private String normalizeRole(
            String role) {

        return role == null
                ? ""
                : role.trim().toUpperCase();
    }
}