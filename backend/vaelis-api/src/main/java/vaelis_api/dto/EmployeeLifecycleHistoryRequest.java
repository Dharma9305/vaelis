package vaelis_api.dto;

import java.time.LocalDate;

public class EmployeeLifecycleHistoryRequest {

    // =========================================================
    // EVENT
    // =========================================================

    private String eventType;

    private LocalDate effectiveDate;

    // =========================================================
    // ORGANIZATION CHANGE
    // =========================================================

    private String previousDepartment;
    private String newDepartment;

    private String previousDesignation;
    private String newDesignation;

    // =========================================================
    // STATUS CHANGE
    // =========================================================

    private String previousStatus;
    private String newStatus;

    // =========================================================
    // MANAGER CHANGE
    // =========================================================

    private Long previousReportingManagerId;
    private Long newReportingManagerId;

    private Long previousFunctionalManagerId;
    private Long newFunctionalManagerId;

    // =========================================================
    // DETAILS
    // =========================================================

    private String reason;
    private String remarks;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeLifecycleHistoryRequest() {
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getPreviousDepartment() {
        return previousDepartment;
    }

    public void setPreviousDepartment(String previousDepartment) {
        this.previousDepartment = previousDepartment;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(String newDepartment) {
        this.newDepartment = newDepartment;
    }

    public String getPreviousDesignation() {
        return previousDesignation;
    }

    public void setPreviousDesignation(String previousDesignation) {
        this.previousDesignation = previousDesignation;
    }

    public String getNewDesignation() {
        return newDesignation;
    }

    public void setNewDesignation(String newDesignation) {
        this.newDesignation = newDesignation;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public Long getPreviousReportingManagerId() {
        return previousReportingManagerId;
    }

    public void setPreviousReportingManagerId(
            Long previousReportingManagerId) {

        this.previousReportingManagerId =
                previousReportingManagerId;
    }

    public Long getNewReportingManagerId() {
        return newReportingManagerId;
    }

    public void setNewReportingManagerId(
            Long newReportingManagerId) {

        this.newReportingManagerId =
                newReportingManagerId;
    }

    public Long getPreviousFunctionalManagerId() {
        return previousFunctionalManagerId;
    }

    public void setPreviousFunctionalManagerId(
            Long previousFunctionalManagerId) {

        this.previousFunctionalManagerId =
                previousFunctionalManagerId;
    }

    public Long getNewFunctionalManagerId() {
        return newFunctionalManagerId;
    }

    public void setNewFunctionalManagerId(
            Long newFunctionalManagerId) {

        this.newFunctionalManagerId =
                newFunctionalManagerId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}