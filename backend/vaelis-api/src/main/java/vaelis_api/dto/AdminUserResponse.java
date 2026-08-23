package vaelis_api.dto;

import vaelis_api.entity.AdminUser;

import java.time.LocalDateTime;

public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private String role;

    private boolean enabled;
    private boolean approved;

    private String approvedBy;
    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // =========================================================
    // DELETION WORKFLOW
    // =========================================================

    private boolean deletionPending;

    private boolean deletionPreviousEnabled;

    private String deletionRequestedBy;
    private LocalDateTime deletionRequestedAt;

    private String deletionApprovedBy;
    private LocalDateTime deletionApprovedAt;

    private String deletionRejectedBy;
    private LocalDateTime deletionRejectedAt;

    private String deletionRejectionReason;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminUserResponse(
            AdminUser user) {

        this.id =
                user.getId();

        this.username =
                user.getUsername();

        this.email =
                user.getEmail();

        this.role =
                user.getRole();

        this.enabled =
                user.isEnabled();

        this.approved =
                user.isApproved();

        this.approvedBy =
                user.getApprovedBy();

        this.approvedAt =
                user.getApprovedAt();

        this.createdAt =
                user.getCreatedAt();

        this.updatedAt =
                user.getUpdatedAt();

        // =====================================================
        // DELETION WORKFLOW
        // =====================================================

        this.deletionPending =
                user.isDeletionPending();

        this.deletionPreviousEnabled =
                user.isDeletionPreviousEnabled();

        this.deletionRequestedBy =
                user.getDeletionRequestedBy();

        this.deletionRequestedAt =
                user.getDeletionRequestedAt();

        this.deletionApprovedBy =
                user.getDeletionApprovedBy();

        this.deletionApprovedAt =
                user.getDeletionApprovedAt();

        this.deletionRejectedBy =
                user.getDeletionRejectedBy();

        this.deletionRejectedAt =
                user.getDeletionRejectedAt();

        this.deletionRejectionReason =
                user.getDeletionRejectionReason();
    }

    // =========================================================
    // BASIC GETTERS
    // =========================================================

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

    public boolean isEnabled() {
        return enabled;
    }

    public boolean isApproved() {
        return approved;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // =========================================================
    // DELETION WORKFLOW GETTERS
    // =========================================================

    public boolean isDeletionPending() {
        return deletionPending;
    }

    public boolean isDeletionPreviousEnabled() {
        return deletionPreviousEnabled;
    }

    public String getDeletionRequestedBy() {
        return deletionRequestedBy;
    }

    public LocalDateTime getDeletionRequestedAt() {
        return deletionRequestedAt;
    }

    public String getDeletionApprovedBy() {
        return deletionApprovedBy;
    }

    public LocalDateTime getDeletionApprovedAt() {
        return deletionApprovedAt;
    }

    public String getDeletionRejectedBy() {
        return deletionRejectedBy;
    }

    public LocalDateTime getDeletionRejectedAt() {
        return deletionRejectedAt;
    }

    public String getDeletionRejectionReason() {
        return deletionRejectionReason;
    }
}