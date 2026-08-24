package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_emergency_contacts",
        indexes = {
                @Index(
                        name = "idx_emergency_contact_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_emergency_contact_primary",
                        columnList = "is_primary"
                )
        }
)
public class EmployeeEmergencyContact {

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
    // CONTACT DETAILS
    // =========================================================

    @Column(
            name = "contact_name",
            nullable = false,
            length = 150
    )
    private String contactName;

    @Column(
            nullable = false,
            length = 50
    )
    private String relationship;

    @Column(
            name = "primary_mobile",
            nullable = false,
            length = 30
    )
    private String primaryMobile;

    @Column(
            name = "alternate_mobile",
            length = 30
    )
    private String alternateMobile;

    @Column(
            length = 255
    )
    private String email;

    // =========================================================
    // ADDRESS
    // =========================================================

    @Column(
            name = "address_line_1",
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
    private String city;

    @Column(
            length = 100
    )
    private String state;

    @Column(
            length = 100
    )
    private String country;

    @Column(
            name = "postal_code",
            length = 20
    )
    private String postalCode;

    // =========================================================
    // STATUS
    // =========================================================

    @Column(
            name = "is_primary",
            nullable = false
    )
    private boolean primary = false;

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

    public EmployeeEmergencyContact() {
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

    public String getContactName() {
        return contactName;
    }

    public void setContactName(
            String contactName) {

        this.contactName = contactName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(
            String relationship) {

        this.relationship = relationship;
    }

    public String getPrimaryMobile() {
        return primaryMobile;
    }

    public void setPrimaryMobile(
            String primaryMobile) {

        this.primaryMobile = primaryMobile;
    }

    public String getAlternateMobile() {
        return alternateMobile;
    }

    public void setAlternateMobile(
            String alternateMobile) {

        this.alternateMobile = alternateMobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
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

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(
            boolean primary) {

        this.primary = primary;
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