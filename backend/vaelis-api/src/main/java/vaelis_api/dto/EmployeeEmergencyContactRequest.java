package vaelis_api.dto;

public class EmployeeEmergencyContactRequest {

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

    private boolean active = true;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeEmergencyContactRequest() {
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

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
}