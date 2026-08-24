package vaelis_api.dto;

import vaelis_api.entity.EmployeeEmergencyContact;

import java.time.LocalDateTime;

public class EmployeeEmergencyContactResponse {

    // =========================================================
    // IDENTITY
    // =========================================================

    private Long id;

    private Long employeeId;

    // =========================================================
    // CONTACT DETAILS
    // =========================================================

    private String contactName;

    private String relationship;

    private String primaryMobile;

    private String alternateMobile;

    private String email;

    // =========================================================
    // ADDRESS
    // =========================================================

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    // =========================================================
    // STATUS
    // =========================================================

    private boolean primary;

    private boolean active;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeEmergencyContactResponse() {
    }

    // =========================================================
    // MAPPER
    // =========================================================

    public static EmployeeEmergencyContactResponse fromEntity(
            EmployeeEmergencyContact contact) {

        EmployeeEmergencyContactResponse response =
                new EmployeeEmergencyContactResponse();

        response.id =
                contact.getId();

        if (contact.getEmployee() != null) {

            response.employeeId =
                    contact.getEmployee().getId();
        }

        response.contactName =
                contact.getContactName();

        response.relationship =
                contact.getRelationship();

        response.primaryMobile =
                contact.getPrimaryMobile();

        response.alternateMobile =
                contact.getAlternateMobile();

        response.email =
                contact.getEmail();

        response.addressLine1 =
                contact.getAddressLine1();

        response.addressLine2 =
                contact.getAddressLine2();

        response.city =
                contact.getCity();

        response.state =
                contact.getState();

        response.country =
                contact.getCountry();

        response.postalCode =
                contact.getPostalCode();

        response.primary =
                contact.isPrimary();

        response.active =
                contact.isActive();

        response.createdAt =
                contact.getCreatedAt();

        response.updatedAt =
                contact.getUpdatedAt();

        return response;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getContactName() {
        return contactName;
    }

    public String getRelationship() {
        return relationship;
    }

    public String getPrimaryMobile() {
        return primaryMobile;
    }

    public String getAlternateMobile() {
        return alternateMobile;
    }

    public String getEmail() {
        return email;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getCountry() {
        return country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public boolean isPrimary() {
        return primary;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}