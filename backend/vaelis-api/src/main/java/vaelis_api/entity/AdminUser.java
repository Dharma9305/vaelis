package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "admin_users",
        indexes = {
                @Index(
                        name = "idx_admin_users_username",
                        columnList = "username",
                        unique = true
                ),
                @Index(
                        name = "idx_admin_users_email",
                        columnList = "email",
                        unique = true
                )
        }
)
public class AdminUser {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // =========================================================
    // USERNAME
    // =========================================================

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String username;

    // =========================================================
    // EMAIL
    // =========================================================

    @Column(
            nullable = false,
            unique = true,
            length = 255
    )
    private String email;

    // =========================================================
    // PASSWORD
    // =========================================================

    @Column(
            nullable = false,
            length = 255
    )
    private String password;

    // =========================================================
    // ROLE
    // =========================================================

    @Column(
            nullable = false,
            length = 30
    )
    private String role;

    // =========================================================
    // ENABLED
    // =========================================================

    @Column(
            nullable = false
    )
    private boolean enabled = true;

    // =========================================================
    // SOFT DELETE
    // =========================================================

    @Column(
            nullable = false
    )
    private boolean deleted = false;

    // =========================================================
    // CREATED AT
    // =========================================================

    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    // =========================================================
    // UPDATED AT
    // =========================================================

    @Column(
            nullable = false
    )
    private LocalDateTime updatedAt;

    // =========================================================
    // APPROVAL STATUS
    // =========================================================

    @Column(
            nullable = false
    )
    private boolean approved = false;

    // =========================================================
    // APPROVED BY
    // =========================================================

    @Column(
            length = 100
    )
    private String approvedBy;

    // =========================================================
    // APPROVED AT
    // =========================================================

    @Column
    private LocalDateTime approvedAt;

    // =========================================================
    // DELETION WORKFLOW
    // =========================================================

    /**
     * True when an Account Manager has requested deletion
     * and the request is waiting for Super Admin decision.
     */
    @Column(
            nullable = false
    )
    private boolean deletionPending = false;

    /**
     * Whether the account was enabled immediately before
     * the deletion request was created.
     *
     * Used to restore the correct state if Super Admin
     * rejects the deletion request.
     */
    @Column(
            nullable = false
    )
    private boolean deletionPreviousEnabled = false;

    /**
     * Account Manager who requested deletion.
     */
    @Column(
            length = 100
    )
    private String deletionRequestedBy;

    /**
     * Time when deletion was requested.
     */
    @Column
    private LocalDateTime deletionRequestedAt;

    /**
     * Super Admin who approved the deletion.
     */
    @Column(
            length = 100
    )
    private String deletionApprovedBy;

    /**
     * Time when deletion was approved.
     */
    @Column
    private LocalDateTime deletionApprovedAt;

    /**
     * Super Admin who rejected the deletion.
     */
    @Column(
            length = 100
    )
    private String deletionRejectedBy;

    /**
     * Time when deletion was rejected.
     */
    @Column
    private LocalDateTime deletionRejectedAt;

    /**
     * Mandatory reason provided by Super Admin
     * when rejecting a deletion request.
     */
    @Column(
            length = 1000
    )
    private String deletionRejectionReason;

    // =========================================================
    // ADMIN PERMISSIONS
    // =========================================================

    @ManyToMany(
            fetch = FetchType.EAGER
    )
    @JoinTable(
            name = "admin_user_permissions",

            joinColumns = @JoinColumn(
                    name = "admin_user_id"
            ),

            inverseJoinColumns = @JoinColumn(
                    name = "permission_id"
            )
    )
    private Set<AdminPermission> permissions =
            new HashSet<>();

    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username) {

        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(
            String role) {

        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(
            boolean enabled) {

        this.enabled = enabled;
    }

    // =========================================================
    // DELETED
    // =========================================================

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(
            boolean deleted) {

        this.deleted = deleted;
    }

    // =========================================================
    // CREATED / UPDATED
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // =========================================================
    // APPROVAL
    // =========================================================

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(
            boolean approved) {

        this.approved = approved;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(
            String approvedBy) {

        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(
            LocalDateTime approvedAt) {

        this.approvedAt = approvedAt;
    }

    // =========================================================
    // DELETION WORKFLOW GETTERS / SETTERS
    // =========================================================

    public boolean isDeletionPending() {
        return deletionPending;
    }

    public void setDeletionPending(
            boolean deletionPending) {

        this.deletionPending = deletionPending;
    }

    public boolean isDeletionPreviousEnabled() {
        return deletionPreviousEnabled;
    }

    public void setDeletionPreviousEnabled(
            boolean deletionPreviousEnabled) {

        this.deletionPreviousEnabled =
                deletionPreviousEnabled;
    }

    public String getDeletionRequestedBy() {
        return deletionRequestedBy;
    }

    public void setDeletionRequestedBy(
            String deletionRequestedBy) {

        this.deletionRequestedBy =
                deletionRequestedBy;
    }

    public LocalDateTime getDeletionRequestedAt() {
        return deletionRequestedAt;
    }

    public void setDeletionRequestedAt(
            LocalDateTime deletionRequestedAt) {

        this.deletionRequestedAt =
                deletionRequestedAt;
    }

    public String getDeletionApprovedBy() {
        return deletionApprovedBy;
    }

    public void setDeletionApprovedBy(
            String deletionApprovedBy) {

        this.deletionApprovedBy =
                deletionApprovedBy;
    }

    public LocalDateTime getDeletionApprovedAt() {
        return deletionApprovedAt;
    }

    public void setDeletionApprovedAt(
            LocalDateTime deletionApprovedAt) {

        this.deletionApprovedAt =
                deletionApprovedAt;
    }

    public String getDeletionRejectedBy() {
        return deletionRejectedBy;
    }

    public void setDeletionRejectedBy(
            String deletionRejectedBy) {

        this.deletionRejectedBy =
                deletionRejectedBy;
    }

    public LocalDateTime getDeletionRejectedAt() {
        return deletionRejectedAt;
    }

    public void setDeletionRejectedAt(
            LocalDateTime deletionRejectedAt) {

        this.deletionRejectedAt =
                deletionRejectedAt;
    }

    public String getDeletionRejectionReason() {
        return deletionRejectionReason;
    }

    public void setDeletionRejectionReason(
            String deletionRejectionReason) {

        this.deletionRejectionReason =
                deletionRejectionReason;
    }

    // =========================================================
    // PERMISSIONS
    // =========================================================

    public Set<AdminPermission> getPermissions() {
        return permissions;
    }

    public void setPermissions(
            Set<AdminPermission> permissions) {

        this.permissions = permissions;
    }
}