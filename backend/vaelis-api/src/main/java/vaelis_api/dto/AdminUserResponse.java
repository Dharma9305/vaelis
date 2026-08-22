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

    public AdminUserResponse(AdminUser user) {

        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.enabled = user.isEnabled();
        this.approved = user.isApproved();
        this.approvedBy = user.getApprovedBy();
        this.approvedAt = user.getApprovedAt();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
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
}
