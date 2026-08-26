package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "admin_permission_requests",
        indexes = {
                @Index(
                        name = "idx_permission_request_target_user",
                        columnList = "target_user_id"
                ),
                @Index(
                        name = "idx_permission_request_permission",
                        columnList = "permission_id"
                ),
                @Index(
                        name = "idx_permission_request_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_permission_request_requested_by",
                        columnList = "requested_by_user_id"
                )
        }
)
public class AdminPermissionRequest {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // =========================================================
    // TARGET USER
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "target_user_id",
            nullable = false
    )
    private AdminUser targetUser;

    // =========================================================
    // PERMISSION
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "permission_id",
            nullable = false
    )
    private AdminPermission permission;

    // =========================================================
    // REQUESTED BY
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "requested_by_user_id",
            nullable = false
    )
    private AdminUser requestedBy;

    // =========================================================
    // REQUESTED BY ROLE
    // =========================================================

    @Column(
            name = "requested_by_role",
            nullable = false,
            length = 30
    )
    private String requestedByRole;

    // =========================================================
    // REASON
    // =========================================================

    @Column(
            length = 1000
    )
    private String reason;

    // =========================================================
    // STATUS
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 40
    )
    private AdminPermissionRequestStatus status =
            AdminPermissionRequestStatus.PENDING_ACCOUNT_MANAGER;

    // =========================================================
    // ACCOUNT MANAGER REVIEW
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "account_manager_reviewer_id"
    )
    private AdminUser accountManagerReviewer;

    @Column(
            name = "account_manager_reviewed_at"
    )
    private LocalDateTime accountManagerReviewedAt;

    @Column(
            name = "account_manager_review_comment",
            length = 1000
    )
    private String accountManagerReviewComment;

    // =========================================================
    // SUPER ADMIN REVIEW
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "super_admin_reviewer_id"
    )
    private AdminUser superAdminReviewer;

    @Column(
            name = "super_admin_reviewed_at"
    )
    private LocalDateTime superAdminReviewedAt;

    @Column(
            name = "super_admin_review_comment",
            length = 1000
    )
    private String superAdminReviewComment;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminPermissionRequest() {
    }

    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {

            status =
                    AdminPermissionRequestStatus
                            .PENDING_ACCOUNT_MANAGER;
        }
    }

    // =========================================================
    // PRE-UPDATE
    // =========================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdminUser getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(
            AdminUser targetUser) {

        this.targetUser = targetUser;
    }

    public AdminPermission getPermission() {
        return permission;
    }

    public void setPermission(
            AdminPermission permission) {

        this.permission = permission;
    }

    public AdminUser getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(
            AdminUser requestedBy) {

        this.requestedBy = requestedBy;
    }

    public String getRequestedByRole() {
        return requestedByRole;
    }

    public void setRequestedByRole(
            String requestedByRole) {

        this.requestedByRole =
                requestedByRole;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(
            String reason) {

        this.reason = reason;
    }

    public AdminPermissionRequestStatus getStatus() {
        return status;
    }

    public void setStatus(
            AdminPermissionRequestStatus status) {

        this.status = status;
    }

    public AdminUser getAccountManagerReviewer() {
        return accountManagerReviewer;
    }

    public void setAccountManagerReviewer(
            AdminUser accountManagerReviewer) {

        this.accountManagerReviewer =
                accountManagerReviewer;
    }

    public LocalDateTime getAccountManagerReviewedAt() {
        return accountManagerReviewedAt;
    }

    public void setAccountManagerReviewedAt(
            LocalDateTime accountManagerReviewedAt) {

        this.accountManagerReviewedAt =
                accountManagerReviewedAt;
    }

    public String getAccountManagerReviewComment() {
        return accountManagerReviewComment;
    }

    public void setAccountManagerReviewComment(
            String accountManagerReviewComment) {

        this.accountManagerReviewComment =
                accountManagerReviewComment;
    }

    public AdminUser getSuperAdminReviewer() {
        return superAdminReviewer;
    }

    public void setSuperAdminReviewer(
            AdminUser superAdminReviewer) {

        this.superAdminReviewer =
                superAdminReviewer;
    }

    public LocalDateTime getSuperAdminReviewedAt() {
        return superAdminReviewedAt;
    }

    public void setSuperAdminReviewedAt(
            LocalDateTime superAdminReviewedAt) {

        this.superAdminReviewedAt =
                superAdminReviewedAt;
    }

    public String getSuperAdminReviewComment() {
        return superAdminReviewComment;
    }

    public void setSuperAdminReviewComment(
            String superAdminReviewComment) {

        this.superAdminReviewComment =
                superAdminReviewComment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
