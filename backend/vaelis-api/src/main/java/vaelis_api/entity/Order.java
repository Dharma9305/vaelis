package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String email;

    private String phone;

    private String address;

    private String city;

    private String district;

    private String state;

    private String pincode;

    private Double subtotal;

    private Double deliveryCharge;

    private Double total;

    // =========================================================
    // PAYMENT INFORMATION
    // =========================================================

    private String paymentStatus = "PENDING";

    private String paymentMethod = "ONLINE";

    private String razorpayOrderId;

    private String razorpayPaymentId;

    // =========================================================
    // ORDER STATUS
    // =========================================================

    private String orderStatus = "PLACED";

    // =========================================================
    // REFUND INFORMATION
    // =========================================================

    private String refundStatus = "NONE";

    private String razorpayRefundId;

    private Double refundedAmount;

    private LocalDateTime refundInitiatedAt;

    private LocalDateTime createdAt;

    // =========================================================
    // SHIPPING INFORMATION
    // =========================================================

    private String shippingPartner;

    private String trackingNumber;

    private String trackingUrl;

    private LocalDate expectedDeliveryDate;

    // =========================================================
    // ORDER ITEMS
    // =========================================================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items =
            new ArrayList<>();

    // =========================================================
    // CREATE DATE
    // =========================================================

    @PrePersist
    protected void onCreate() {

        createdAt =
                LocalDateTime.now();
    }

    // =========================================================
    // ID
    // =========================================================

    public Long getId() {
        return id;
    }

    // =========================================================
    // CUSTOMER INFORMATION
    // =========================================================

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(
            String customerName) {

        this.customerName =
                customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email =
                email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone) {

        this.phone =
                phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address) {

        this.address =
                address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city) {

        this.city =
                city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(
            String district) {

        this.district =
                district;
    }

    public String getState() {
        return state;
    }

    public void setState(
            String state) {

        this.state =
                state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(
            String pincode) {

        this.pincode =
                pincode;
    }

    // =========================================================
    // PRICE INFORMATION
    // =========================================================

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(
            Double subtotal) {

        this.subtotal =
                subtotal;
    }

    public Double getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(
            Double deliveryCharge) {

        this.deliveryCharge =
                deliveryCharge;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(
            Double total) {

        this.total =
                total;
    }

    // =========================================================
    // PAYMENT STATUS
    // =========================================================

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(
            String paymentStatus) {

        this.paymentStatus =
                paymentStatus;
    }

    // =========================================================
    // PAYMENT METHOD
    // =========================================================

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(
            String paymentMethod) {

        this.paymentMethod =
                paymentMethod;
    }

    // =========================================================
    // RAZORPAY ORDER ID
    // =========================================================

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(
            String razorpayOrderId) {

        this.razorpayOrderId =
                razorpayOrderId;
    }

    // =========================================================
    // RAZORPAY PAYMENT ID
    // =========================================================

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(
            String razorpayPaymentId) {

        this.razorpayPaymentId =
                razorpayPaymentId;
    }

    // =========================================================
    // ORDER STATUS
    // =========================================================

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(
            String orderStatus) {

        this.orderStatus =
                orderStatus;
    }

    // =========================================================
    // REFUND STATUS
    // =========================================================

    public String getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(
            String refundStatus) {

        this.refundStatus =
                refundStatus;
    }

    // =========================================================
    // RAZORPAY REFUND ID
    // =========================================================

    public String getRazorpayRefundId() {
        return razorpayRefundId;
    }

    public void setRazorpayRefundId(
            String razorpayRefundId) {

        this.razorpayRefundId =
                razorpayRefundId;
    }

    // =========================================================
    // REFUNDED AMOUNT
    // =========================================================

    public Double getRefundedAmount() {
        return refundedAmount;
    }

    public void setRefundedAmount(
            Double refundedAmount) {

        this.refundedAmount =
                refundedAmount;
    }

    // =========================================================
    // REFUND INITIATED AT
    // =========================================================

    public LocalDateTime getRefundInitiatedAt() {
        return refundInitiatedAt;
    }

    public void setRefundInitiatedAt(
            LocalDateTime refundInitiatedAt) {

        this.refundInitiatedAt =
                refundInitiatedAt;
    }

    // =========================================================
    // CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // =========================================================
    // SHIPPING INFORMATION
    // =========================================================

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

    // =========================================================
    // ORDER ITEMS
    // =========================================================

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItem> items) {

        this.items =
                items;
    }

    public void addItem(
            OrderItem item) {

        items.add(item);

        item.setOrder(this);
    }
}