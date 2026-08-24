package vaelis_api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeEmploymentHistoryRequest {

    private String companyName;
    private String companyLocation;
    private String industry;

    private String jobTitle;
    private String designation;
    private String department;
    private String employmentType;

    private LocalDate startDate;
    private LocalDate endDate;

    private String lastDrawnDesignation;
    private BigDecimal lastDrawnSalary;

    private String reasonForLeaving;

    private String reportingManager;
    private String hrContactName;
    private String hrContactEmail;
    private String hrContactMobile;

    private String verificationStatus;
    private String verificationReference;

    private Boolean active;

    public EmployeeEmploymentHistoryRequest() {
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLastDrawnDesignation() {
        return lastDrawnDesignation;
    }

    public void setLastDrawnDesignation(String lastDrawnDesignation) {
        this.lastDrawnDesignation = lastDrawnDesignation;
    }

    public BigDecimal getLastDrawnSalary() {
        return lastDrawnSalary;
    }

    public void setLastDrawnSalary(BigDecimal lastDrawnSalary) {
        this.lastDrawnSalary = lastDrawnSalary;
    }

    public String getReasonForLeaving() {
        return reasonForLeaving;
    }

    public void setReasonForLeaving(String reasonForLeaving) {
        this.reasonForLeaving = reasonForLeaving;
    }

    public String getReportingManager() {
        return reportingManager;
    }

    public void setReportingManager(String reportingManager) {
        this.reportingManager = reportingManager;
    }

    public String getHrContactName() {
        return hrContactName;
    }

    public void setHrContactName(String hrContactName) {
        this.hrContactName = hrContactName;
    }

    public String getHrContactEmail() {
        return hrContactEmail;
    }

    public void setHrContactEmail(String hrContactEmail) {
        this.hrContactEmail = hrContactEmail;
    }

    public String getHrContactMobile() {
        return hrContactMobile;
    }

    public void setHrContactMobile(String hrContactMobile) {
        this.hrContactMobile = hrContactMobile;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationReference() {
        return verificationReference;
    }

    public void setVerificationReference(String verificationReference) {
        this.verificationReference = verificationReference;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}