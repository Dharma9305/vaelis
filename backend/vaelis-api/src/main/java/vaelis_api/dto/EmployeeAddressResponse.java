package vaelis_api.dto;

import vaelis_api.entity.EmployeeAddress;

import java.time.LocalDateTime;

public class EmployeeAddressResponse {

    private Long id;

    private Long employeeId;

    private String addressType;

    private String addressLine1;

    private String addressLine2;

    private String landmark;

    private String city;

    private String state;

    private String district;

    private String country;

    private String postalCode;

    private String contactMobile;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeAddressResponse() {
    }

    // =========================================================
    // MAPPER
    // =========================================================

    public static EmployeeAddressResponse fromEntity(
            EmployeeAddress address) {

        EmployeeAddressResponse response =
                new EmployeeAddressResponse();

        response.id =
                address.getId();

        if (address.getEmployee() != null) {
            response.employeeId =
                    address.getEmployee().getId();
        }

        response.addressType =
                address.getAddressType();

        response.addressLine1 =
                address.getAddressLine1();

        response.addressLine2 =
                address.getAddressLine2();

        response.landmark =
                address.getLandmark();

        response.city =
                address.getCity();

        response.state =
                address.getState();

        response.district =
                address.getDistrict();

        response.country =
                address.getCountry();

        response.postalCode =
                address.getPostalCode();

        response.contactMobile =
                address.getContactMobile();

        response.active =
                address.isActive();

        response.createdAt =
                address.getCreatedAt();

        response.updatedAt =
                address.getUpdatedAt();

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

    public String getAddressType() {
        return addressType;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public String getLandmark() {
        return landmark;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getDistrict() {
        return district;
    }

    public String getCountry() {
        return country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getContactMobile() {
        return contactMobile;
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
