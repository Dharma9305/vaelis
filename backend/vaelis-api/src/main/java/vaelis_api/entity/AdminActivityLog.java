package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "admin_activity_logs",
        indexes = {
                @Index(
                        name = "idx_admin_activity_actor",
                        columnList = "actor_username"
                ),
                @Index(
                        name = "idx_admin_activity_target",
                        columnList = "target_user_id"
                ),
                @Index(
                        name = "idx_admin_activity_created",
                        columnList = "created_at"
                )
        }
)
public class AdminActivityLog {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // ACTOR
    // =========================================================

    @Column(
            nullable = false,
            length = 100
    )
    private String actorUsername;

    @Column(
            nullable = false,
            length = 50
    )
    private String actorRole;

    // =========================================================
    // ACTION
    // =========================================================

    @Column(
            nullable = false,
            length = 100
    )
    private String action;

    // =========================================================
    // TARGET USER
    // =========================================================

    @Column
    private Long targetUserId;

    @Column(length = 100)
    private String targetUsername;

    @Column(length = 50)
    private String targetRole;

    // =========================================================
    // DETAILS
    // =========================================================

    @Column(length = 1000)
    private String details;

    // =========================================================
    // RESULT
    // =========================================================

    @Column(
            nullable = false,
            length = 30
    )
    private String result;

    // =========================================================
    // CREATED AT
    // =========================================================

    @Column(
            nullable = false
    )
    private LocalDateTime createdAt;

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public AdminActivityLog() {
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

    public String getActorUsername() {
        return actorUsername;
    }

    public void setActorUsername(String actorUsername) {
        this.actorUsername = actorUsername;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getTargetUsername() {
        return targetUsername;
    }

    public void setTargetUsername(String targetUsername) {
        this.targetUsername = targetUsername;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}