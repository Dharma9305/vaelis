package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_shipment_audit_logs")
public class OrderShipmentAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // ORDER
    // =========================================================

    @Column(nullable = false)
    private Long orderId;

    // =========================================================
    // SHIPMENT DETAILS AT TIME OF UPDATE
    // =========================================================

    @Column
    private String shippingPartner;

    @Column
    private String trackingNumber;

    @Column
    private String trackingUrl;

    @Column
    private LocalDate expectedDeliveryDate;

    // =========================================================
    // USER
    // =========================================================

    @Column(nullable = false)
    private String changedBy;

    @Column(nullable = false)
    private String changedByRole;

    // =========================================================
    // TIMESTAMP
    // =========================================================

    @Column(nullable = false)
    private LocalDateTime changedAt;

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public OrderShipmentAuditLog() {
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

    public String getShippingPartner() {
        return shippingPartner;
    }

    public void setShippingPartner(
            String shippingPartner) {

        this.shippingPartner =
                shippingPartner;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(
            String trackingNumber) {

        this.trackingNumber =
                trackingNumber;
    }

    public String getTrackingUrl() {
        return trackingUrl;
    }

    public void setTrackingUrl(
            String trackingUrl) {

        this.trackingUrl =
                trackingUrl;
    }

    public LocalDate getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(
            LocalDate expectedDeliveryDate) {

        this.expectedDeliveryDate =
                expectedDeliveryDate;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(
            String changedBy) {

        this.changedBy =
                changedBy;
    }

    public String getChangedByRole() {
        return changedByRole;
    }

    public void setChangedByRole(
            String changedByRole) {

        this.changedByRole =
                changedByRole;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(
            LocalDateTime changedAt) {

        this.changedAt =
                changedAt;
    }
}