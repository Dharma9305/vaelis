package vaelis_api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_employment_history",
        indexes = {
                @Index(
                        name = "idx_employment_history_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employment_history_company",
                        columnList = "company_name"
                ),
                @Index(
                        name = "idx_employment_history_verification",
                        columnList = "verification_status"
                )
        }
)
public class EmployeeEmploymentHistory {

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
    // ORGANIZATION
    // =========================================================

    @Column(
            name = "company_name",
            nullable = false,
            length = 255
    )
    private String companyName;

    @Column(
            name = "company_location",
            length = 255
    )
    private String companyLocation;

    @Column(
            length = 150
    )
    private String industry;

    // =========================================================
    // POSITION
    // =========================================================

    @Column(
            name = "job_title",
            nullable = false,
            length = 150
    )
    private String jobTitle;

    @Column(
            length = 150
    )
    private String designation;

    @Column(
            length = 100
    )
    private String department;

    @Column(
            name = "employment_type",
            length = 50
    )
    private String employmentType;

    // =========================================================
    // EMPLOYMENT PERIOD
    // =========================================================

    @Column(
            name = "start_date"
    )
    private LocalDate startDate;

    @Column(
            name = "end_date"
    )
    private LocalDate endDate;

    // =========================================================
    // LAST POSITION
    // =========================================================

    @Column(
            name = "last_drawn_designation",
            length = 150
    )
    private String lastDrawnDesignation;

    // =========================================================
    // LAST DRAWN SALARY
    // =========================================================
    //
    // Stored as a numeric value for accurate financial records.
    //

    @Column(
            name = "last_drawn_salary",
            precision = 15,
            scale = 2
    )
    private BigDecimal lastDrawnSalary;

    // =========================================================
    // REASON FOR LEAVING
    // =========================================================

    @Column(
            name = "reason_for_leaving",
            length = 500
    )
    private String reasonForLeaving;

    // =========================================================
    // PREVIOUS EMPLOYER CONTACT
    // =========================================================

    @Column(
            name = "reporting_manager",
            length = 150
    )
    private String reportingManager;

    @Column(
            name = "hr_contact_name",
            length = 150
    )
    private String hrContactName;

    @Column(
            name = "hr_contact_email",
            length = 255
    )
    private String hrContactEmail;

    @Column(
            name = "hr_contact_mobile",
            length = 30
    )
    private String hrContactMobile;

    // =========================================================
    // VERIFICATION
    // =========================================================

    @Column(
            name = "verification_status",
            nullable = false,
            length = 40
    )
    private String verificationStatus = "PENDING";

    @Column(
            name = "verification_reference",
            length = 500
    )
    private String verificationReference;

    // =========================================================
    // STATUS
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

    public EmployeeEmploymentHistory() {
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(
            String companyName) {

        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(
            String companyLocation) {

        this.companyLocation =
                companyLocation;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(
            String industry) {

        this.industry = industry;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(
            String jobTitle) {

        this.jobTitle = jobTitle;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(
            String designation) {

        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(
            String department) {

        this.department = department;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(
            String employmentType) {

        this.employmentType = employmentType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(
            LocalDate startDate) {

        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(
            LocalDate endDate) {

        this.endDate = endDate;
    }

    public String getLastDrawnDesignation() {
        return lastDrawnDesignation;
    }

    public void setLastDrawnDesignation(
            String lastDrawnDesignation) {

        this.lastDrawnDesignation =
                lastDrawnDesignation;
    }

    public BigDecimal getLastDrawnSalary() {
        return lastDrawnSalary;
    }

    public void setLastDrawnSalary(
            BigDecimal lastDrawnSalary) {

        this.lastDrawnSalary =
                lastDrawnSalary;
    }

    public String getReasonForLeaving() {
        return reasonForLeaving;
    }

    public void setReasonForLeaving(
            String reasonForLeaving) {

        this.reasonForLeaving =
                reasonForLeaving;
    }

    public String getReportingManager() {
        return reportingManager;
    }

    public void setReportingManager(
            String reportingManager) {

        this.reportingManager =
                reportingManager;
    }

    public String getHrContactName() {
        return hrContactName;
    }

    public void setHrContactName(
            String hrContactName) {

        this.hrContactName =
                hrContactName;
    }

    public String getHrContactEmail() {
        return hrContactEmail;
    }

    public void setHrContactEmail(
            String hrContactEmail) {

        this.hrContactEmail =
                hrContactEmail;
    }

    public String getHrContactMobile() {
        return hrContactMobile;
    }

    public void setHrContactMobile(
            String hrContactMobile) {

        this.hrContactMobile =
                hrContactMobile;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            String verificationStatus) {

        this.verificationStatus =
                verificationStatus;
    }

    public String getVerificationReference() {
        return verificationReference;
    }

    public void setVerificationReference(
            String verificationReference) {

        this.verificationReference =
                verificationReference;
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