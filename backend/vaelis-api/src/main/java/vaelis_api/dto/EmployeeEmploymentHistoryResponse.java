package vaelis_api.dto;

import vaelis_api.entity.EmployeeEmploymentHistory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeEmploymentHistoryResponse {

    private Long id;
    private Long employeeId;

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

    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeEmploymentHistoryResponse() {
    }

    public static EmployeeEmploymentHistoryResponse fromEntity(
            EmployeeEmploymentHistory entity) {

        EmployeeEmploymentHistoryResponse response =
                new EmployeeEmploymentHistoryResponse();

        response.id = entity.getId();

        if (entity.getEmployee() != null) {
            response.employeeId =
                    entity.getEmployee().getId();
        }

        response.companyName =
                entity.getCompanyName();

        response.companyLocation =
                entity.getCompanyLocation();

        response.industry =
                entity.getIndustry();

        response.jobTitle =
                entity.getJobTitle();

        response.designation =
                entity.getDesignation();

        response.department =
                entity.getDepartment();

        response.employmentType =
                entity.getEmploymentType();

        response.startDate =
                entity.getStartDate();

        response.endDate =
                entity.getEndDate();

        response.lastDrawnDesignation =
                entity.getLastDrawnDesignation();

        response.lastDrawnSalary =
                entity.getLastDrawnSalary();

        response.reasonForLeaving =
                entity.getReasonForLeaving();

        response.reportingManager =
                entity.getReportingManager();

        response.hrContactName =
                entity.getHrContactName();

        response.hrContactEmail =
                entity.getHrContactEmail();

        response.hrContactMobile =
                entity.getHrContactMobile();

        response.verificationStatus =
                entity.getVerificationStatus();

        response.verificationReference =
                entity.getVerificationReference();

        response.active =
                entity.isActive();

        response.createdAt =
                entity.getCreatedAt();

        response.updatedAt =
                entity.getUpdatedAt();

        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public String getIndustry() {
        return industry;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getDesignation() {
        return designation;
    }

    public String getDepartment() {
        return department;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getLastDrawnDesignation() {
        return lastDrawnDesignation;
    }

    public BigDecimal getLastDrawnSalary() {
        return lastDrawnSalary;
    }

    public String getReasonForLeaving() {
        return reasonForLeaving;
    }

    public String getReportingManager() {
        return reportingManager;
    }

    public String getHrContactName() {
        return hrContactName;
    }

    public String getHrContactEmail() {
        return hrContactEmail;
    }

    public String getHrContactMobile() {
        return hrContactMobile;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public String getVerificationReference() {
        return verificationReference;
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