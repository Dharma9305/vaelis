package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_audit_logs")
public class OrderStatusAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // ORDER ID
    // =========================================================

    @Column(nullable = false)
    private Long orderId;

    // =========================================================
    // STATUS BEFORE CHANGE
    // =========================================================

    @Column(nullable = false)
    private String fromStatus;

    // =========================================================
    // STATUS AFTER CHANGE
    // =========================================================

    @Column(nullable = false)
    private String toStatus;

    // =========================================================
    // USER WHO MADE THE CHANGE
    // =========================================================

    @Column(nullable = false)
    private String changedBy;

    // =========================================================
    // ROLE OF USER
    // =========================================================

    @Column(nullable = false)
    private String changedByRole;

    // =========================================================
    // CHANGE TIME
    // =========================================================

    @Column(nullable = false)
    private LocalDateTime changedAt;

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public OrderStatusAuditLog() {
    }

    public OrderStatusAuditLog(
            Long orderId,
            String fromStatus,
            String toStatus,
            String changedBy,
            String changedByRole,
            LocalDateTime changedAt) {

        this.orderId = orderId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedBy = changedBy;
        this.changedByRole = changedByRole;
        this.changedAt = changedAt;
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(String fromStatus) {
        this.fromStatus = fromStatus;
    }

    public String getToStatus() {
        return toStatus;
    }

    public void setToStatus(String toStatus) {
        this.toStatus = toStatus;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public String getChangedByRole() {
        return changedByRole;
    }

    public void setChangedByRole(String changedByRole) {
        this.changedByRole = changedByRole;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}