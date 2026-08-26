package vaelis_api.controller;

import vaelis_api.dto.AdminPermissionRequestResponse;
import vaelis_api.entity.AdminPermissionRequest;
import vaelis_api.entity.AdminPermissionRequestStatus;
import vaelis_api.service.AdminPermissionRequestService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/permission-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminPermissionRequestController {

    private final AdminPermissionRequestService
            permissionRequestService;

    public AdminPermissionRequestController(
            AdminPermissionRequestService permissionRequestService) {

        this.permissionRequestService =
                permissionRequestService;
    }

    // =========================================================
    // CREATE REQUEST
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody PermissionRequestCreateRequest request,
            Authentication authentication) {

        try {

            AdminPermissionRequest created =
                    permissionRequestService
                            .createRequest(
                                    request.getTargetUserId(),
                                    request.getPermissionId(),
                                    request.getReason(),
                                    authentication
                            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            AdminPermissionRequestResponse
                                    .from(created)
                    );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllRequests(
            Authentication authentication) {

        try {

            requireReviewRole(authentication);

            List<AdminPermissionRequest> requests =
                    permissionRequestService
                            .getAllRequests();

            return ResponseEntity.ok(
                    toResponseList(requests)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET REQUEST BY ID
    // =========================================================

    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        try {

            requireReviewRole(authentication);

            AdminPermissionRequest request =
                    permissionRequestService
                            .getRequest(requestId);

            return ResponseEntity.ok(
                    AdminPermissionRequestResponse
                            .from(request)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET REQUESTS FOR TARGET USER
    // =========================================================

    @GetMapping("/user/{targetUserId}")
    public ResponseEntity<?> getRequestsForUser(
            @PathVariable Long targetUserId,
            Authentication authentication) {

        try {

            requireReviewRole(authentication);

            List<AdminPermissionRequest> requests =
                    permissionRequestService
                            .getRequestsForUser(
                                    targetUserId
                            );

            return ResponseEntity.ok(
                    toResponseList(requests)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET REQUESTS BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getRequestsByStatus(
            @PathVariable
            AdminPermissionRequestStatus status,
            Authentication authentication) {

        try {

            requireReviewRole(authentication);

            List<AdminPermissionRequest> requests =
                    permissionRequestService
                            .getRequestsByStatus(status);

            return ResponseEntity.ok(
                    toResponseList(requests)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid permission request status."
                    );
        }
    }

    // =========================================================
    // ACCOUNT MANAGER APPROVE
    // =========================================================

    @PostMapping(
            "/{requestId}/account-manager/approve"
    )
    public ResponseEntity<?> approveByAccountManager(
            @PathVariable Long requestId,
            @RequestBody(required = false)
            ReviewRequest request,
            Authentication authentication) {

        try {

            String comment =
                    request != null
                            ? request.getComment()
                            : null;

            AdminPermissionRequest updated =
                    permissionRequestService
                            .approveByAccountManager(
                                    requestId,
                                    comment,
                                    authentication
                            );

            return ResponseEntity.ok(
                    AdminPermissionRequestResponse
                            .from(updated)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // ACCOUNT MANAGER REJECT
    // =========================================================

    @PostMapping(
            "/{requestId}/account-manager/reject"
    )
    public ResponseEntity<?> rejectByAccountManager(
            @PathVariable Long requestId,
            @RequestBody(required = false)
            ReviewRequest request,
            Authentication authentication) {

        try {

            String comment =
                    request != null
                            ? request.getComment()
                            : null;

            AdminPermissionRequest updated =
                    permissionRequestService
                            .rejectByAccountManager(
                                    requestId,
                                    comment,
                                    authentication
                            );

            return ResponseEntity.ok(
                    AdminPermissionRequestResponse
                            .from(updated)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // SUPER ADMIN APPROVE
    // =========================================================

    @PostMapping(
            "/{requestId}/super-admin/approve"
    )
    public ResponseEntity<?> approveBySuperAdmin(
            @PathVariable Long requestId,
            @RequestBody(required = false)
            ReviewRequest request,
            Authentication authentication) {

        try {

            String comment =
                    request != null
                            ? request.getComment()
                            : null;

            AdminPermissionRequest updated =
                    permissionRequestService
                            .approveBySuperAdmin(
                                    requestId,
                                    comment,
                                    authentication
                            );

            return ResponseEntity.ok(
                    AdminPermissionRequestResponse
                            .from(updated)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // SUPER ADMIN REJECT
    // =========================================================

    @PostMapping(
            "/{requestId}/super-admin/reject"
    )
    public ResponseEntity<?> rejectBySuperAdmin(
            @PathVariable Long requestId,
            @RequestBody(required = false)
            ReviewRequest request,
            Authentication authentication) {

        try {

            String comment =
                    request != null
                            ? request.getComment()
                            : null;

            AdminPermissionRequest updated =
                    permissionRequestService
                            .rejectBySuperAdmin(
                                    requestId,
                                    comment,
                                    authentication
                            );

            return ResponseEntity.ok(
                    AdminPermissionRequestResponse
                            .from(updated)
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // CONVERT LIST
    // =========================================================

    private List<AdminPermissionRequestResponse>
    toResponseList(
            List<AdminPermissionRequest> requests) {

        return requests
                .stream()
                .map(
                        AdminPermissionRequestResponse::from
                )
                .toList();
    }

    // =========================================================
    // REVIEW ROLE CHECK
    // =========================================================

    private void requireReviewRole(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "Authentication is required."
            );
        }

        String authority =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(authorityValue ->
                                authorityValue
                                        .getAuthority())
                        .filter(value ->
                                value.startsWith("ROLE_"))
                        .findFirst()
                        .orElse("");

        if ("ROLE_ACCOUNT_MANAGER".equalsIgnoreCase(
                authority
        )) {
            return;
        }

        if ("ROLE_SUPER_ADMIN".equalsIgnoreCase(
                authority
        )) {
            return;
        }

        throw new SecurityException(
                "Only ACCOUNT_MANAGER or SUPER_ADMIN can review permission requests."
        );
    }

    // =========================================================
    // CREATE REQUEST DTO
    // =========================================================

    public static class PermissionRequestCreateRequest {

        private Long targetUserId;

        private Long permissionId;

        private String reason;

        public PermissionRequestCreateRequest() {
        }

        public Long getTargetUserId() {
            return targetUserId;
        }

        public void setTargetUserId(
                Long targetUserId) {

            this.targetUserId =
                    targetUserId;
        }

        public Long getPermissionId() {
            return permissionId;
        }

        public void setPermissionId(
                Long permissionId) {

            this.permissionId =
                    permissionId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(
                String reason) {

            this.reason = reason;
        }
    }

    // =========================================================
    // REVIEW DTO
    // =========================================================

    public static class ReviewRequest {

        private String comment;

        public ReviewRequest() {
        }

        public String getComment() {
            return comment;
        }

        public void setComment(
                String comment) {

            this.comment = comment;
        }
    }
}