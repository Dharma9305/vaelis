package vaelis_api.dto;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminPermissionRequest;
import vaelis_api.entity.AdminPermissionRequestStatus;
import vaelis_api.entity.AdminUser;

import java.time.LocalDateTime;

public class AdminPermissionRequestResponse {

    // =========================================================
    // REQUEST
    // =========================================================

    private Long id;

    private UserSummary targetUser;

    private PermissionSummary permission;

    private UserSummary requestedBy;

    private String requestedByRole;

    private String reason;

    private AdminPermissionRequestStatus status;

    // =========================================================
    // ACCOUNT MANAGER REVIEW
    // =========================================================

    private UserSummary accountManagerReviewer;

    private LocalDateTime accountManagerReviewedAt;

    private String accountManagerReviewComment;

    // =========================================================
    // SUPER ADMIN REVIEW
    // =========================================================

    private UserSummary superAdminReviewer;

    private LocalDateTime superAdminReviewedAt;

    private String superAdminReviewComment;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminPermissionRequestResponse() {
    }

    // =========================================================
    // FACTORY
    // =========================================================

    public static AdminPermissionRequestResponse from(
            AdminPermissionRequest request) {

        if (request == null) {
            return null;
        }

        AdminPermissionRequestResponse response =
                new AdminPermissionRequestResponse();

        response.id =
                request.getId();

        response.targetUser =
                UserSummary.from(
                        request.getTargetUser()
                );

        response.permission =
                PermissionSummary.from(
                        request.getPermission()
                );

        response.requestedBy =
                UserSummary.from(
                        request.getRequestedBy()
                );

        response.requestedByRole =
                request.getRequestedByRole();

        response.reason =
                request.getReason();

        response.status =
                request.getStatus();

        response.accountManagerReviewer =
                UserSummary.from(
                        request.getAccountManagerReviewer()
                );

        response.accountManagerReviewedAt =
                request.getAccountManagerReviewedAt();

        response.accountManagerReviewComment =
                request.getAccountManagerReviewComment();

        response.superAdminReviewer =
                UserSummary.from(
                        request.getSuperAdminReviewer()
                );

        response.superAdminReviewedAt =
                request.getSuperAdminReviewedAt();

        response.superAdminReviewComment =
                request.getSuperAdminReviewComment();

        response.createdAt =
                request.getCreatedAt();

        response.updatedAt =
                request.getUpdatedAt();

        return response;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public UserSummary getTargetUser() {
        return targetUser;
    }

    public PermissionSummary getPermission() {
        return permission;
    }

    public UserSummary getRequestedBy() {
        return requestedBy;
    }

    public String getRequestedByRole() {
        return requestedByRole;
    }

    public String getReason() {
        return reason;
    }

    public AdminPermissionRequestStatus getStatus() {
        return status;
    }

    public UserSummary getAccountManagerReviewer() {
        return accountManagerReviewer;
    }

    public LocalDateTime getAccountManagerReviewedAt() {
        return accountManagerReviewedAt;
    }

    public String getAccountManagerReviewComment() {
        return accountManagerReviewComment;
    }

    public UserSummary getSuperAdminReviewer() {
        return superAdminReviewer;
    }

    public LocalDateTime getSuperAdminReviewedAt() {
        return superAdminReviewedAt;
    }

    public String getSuperAdminReviewComment() {
        return superAdminReviewComment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // =========================================================
    // SAFE USER SUMMARY
    // =========================================================

    public static class UserSummary {

        private Long id;

        private String username;

        private String email;

        private String role;

        public UserSummary() {
        }

        public UserSummary(
                Long id,
                String username,
                String email,
                String role) {

            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        public static UserSummary from(
                AdminUser user) {

            if (user == null) {
                return null;
            }

            return new UserSummary(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );
        }

        public Long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }

    // =========================================================
    // SAFE PERMISSION SUMMARY
    // =========================================================

    public static class PermissionSummary {

        private Long id;

        private String code;

        private String name;

        private String description;

        private boolean enabled;

        public PermissionSummary() {
        }

        public static PermissionSummary from(
                AdminPermission permission) {

            if (permission == null) {
                return null;
            }

            PermissionSummary summary =
                    new PermissionSummary();

            summary.id =
                    permission.getId();

            summary.code =
                    permission.getCode();

            summary.name =
                    permission.getName();

            summary.description =
                    permission.getDescription();

            summary.enabled =
                    permission.isEnabled();

            return summary;
        }

        public Long getId() {
            return id;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public boolean isEnabled() {
            return enabled;
        }
    }
}