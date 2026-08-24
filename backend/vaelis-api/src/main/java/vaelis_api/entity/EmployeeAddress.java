package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_addresses",
        indexes = {
                @Index(
                        name = "idx_employee_address_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employee_address_type",
                        columnList = "address_type"
                )
        }
)
public class EmployeeAddress {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // =========================================================
    // EMPLOYEE
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "employee_id",
            nullable = false
    )
    private EmployeeRecord employee;

    // =========================================================
    // ADDRESS TYPE
    // =========================================================
    //
    // CURRENT
    // PERMANENT
    // OTHER
    //

    @Column(
            name = "address_type",
            nullable = false,
            length = 30
    )
    private String addressType;

    // =========================================================
    // ADDRESS
    // =========================================================

    @Column(
            name = "address_line_1",
            nullable = false,
            length = 255
    )
    private String addressLine1;

    @Column(
            name = "address_line_2",
            length = 255
    )
    private String addressLine2;

    @Column(
            length = 100
    )
    private String landmark;

    @Column(
            nullable = false,
            length = 100
    )
    private String city;

    @Column(
            nullable = false,
            length = 100
    )
    private String state;

    @Column(
            length = 100
    )
    private String district;

    @Column(
            nullable = false,
            length = 100
    )
    private String country;

    @Column(
            name = "postal_code",
            nullable = false,
            length = 20
    )
    private String postalCode;

    // =========================================================
    // CONTACT AT ADDRESS
    // =========================================================

    @Column(
            name = "contact_mobile",
            length = 30
    )
    private String contactMobile;

    // =========================================================
    // ADDRESS STATUS
    // =========================================================

    @Column(
            nullable = false
    )
    private boolean active = true;

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

    public EmployeeAddress() {
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

    public EmployeeRecord getEmployee() {
        return employee;
    }

    public void setEmployee(
            EmployeeRecord employee) {

        this.employee = employee;
    }

    public String getAddressType() {
        return addressType;
    }

    public void setAddressType(
            String addressType) {

        this.addressType = addressType;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(
            String addressLine1) {

        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(
            String addressLine2) {

        this.addressLine2 = addressLine2;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(
            String landmark) {

        this.landmark = landmark;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city) {

        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(
            String state) {

        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(
            String district) {

        this.district = district;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(
            String country) {

        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(
            String postalCode) {

        this.postalCode = postalCode;
    }

    public String getContactMobile() {
        return contactMobile;
    }

    public void setContactMobile(
            String contactMobile) {

        this.contactMobile = contactMobile;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active) {

        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}