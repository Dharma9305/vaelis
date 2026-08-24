package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_lifecycle_history",
        indexes = {
                @Index(
                        name = "idx_employee_lifecycle_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employee_lifecycle_event",
                        columnList = "event_type"
                ),
                @Index(
                        name = "idx_employee_lifecycle_effective",
                        columnList = "effective_date"
                ),
                @Index(
                        name = "idx_employee_lifecycle_created",
                        columnList = "created_at"
                )
        }
)
public class EmployeeLifecycleHistory {

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
    // EVENT
    // =========================================================

    @Column(
            name = "event_type",
            nullable = false,
            length = 60
    )
    private String eventType;

    // =========================================================
    // EMPLOYMENT STATUS CHANGE
    // =========================================================

    @Column(
            name = "previous_status",
            length = 40
    )
    private String previousStatus;

    @Column(
            name = "new_status",
            length = 40
    )
    private String newStatus;

    // =========================================================
    // DEPARTMENT CHANGE
    // =========================================================

    @Column(
            name = "previous_department",
            length = 100
    )
    private String previousDepartment;

    @Column(
            name = "new_department",
            length = 100
    )
    private String newDepartment;

    // =========================================================
    // DESIGNATION CHANGE
    // =========================================================

    @Column(
            name = "previous_designation",
            length = 100
    )
    private String previousDesignation;

    @Column(
            name = "new_designation",
            length = 100
    )
    private String newDesignation;

    // =========================================================
    // REPORTING MANAGER CHANGE
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "previous_reporting_manager_id"
    )
    private EmployeeRecord previousReportingManager;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "new_reporting_manager_id"
    )
    private EmployeeRecord newReportingManager;

    // =========================================================
    // FUNCTIONAL MANAGER CHANGE
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "previous_functional_manager_id"
    )
    private EmployeeRecord previousFunctionalManager;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "new_functional_manager_id"
    )
    private EmployeeRecord newFunctionalManager;

    // =========================================================
    // EFFECTIVE DATE
    // =========================================================

    @Column(
            name = "effective_date"
    )
    private LocalDate effectiveDate;

    // =========================================================
    // REASON / REMARKS
    // =========================================================

    @Column(
            length = 1000
    )
    private String reason;

    @Column(
            length = 2000
    )
    private String remarks;

    // =========================================================
    // CHANGED BY
    // =========================================================

    @Column(
            name = "changed_by",
            length = 150
    )
    private String changedBy;

    @Column(
            name = "changed_by_role",
            length = 80
    )
    private String changedByRole;

    // =========================================================
    // TIMESTAMP
    // =========================================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeLifecycleHistory() {
    }

    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }
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

    public String getEventType() {
        return eventType;
    }

    public void setEventType(
            String eventType) {

        this.eventType = eventType;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(
            String previousStatus) {

        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(
            String newStatus) {

        this.newStatus = newStatus;
    }

    public String getPreviousDepartment() {
        return previousDepartment;
    }

    public void setPreviousDepartment(
            String previousDepartment) {

        this.previousDepartment =
                previousDepartment;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(
            String newDepartment) {

        this.newDepartment = newDepartment;
    }

    public String getPreviousDesignation() {
        return previousDesignation;
    }

    public void setPreviousDesignation(
            String previousDesignation) {

        this.previousDesignation =
                previousDesignation;
    }

    public String getNewDesignation() {
        return newDesignation;
    }

    public void setNewDesignation(
            String newDesignation) {

        this.newDesignation = newDesignation;
    }

    public EmployeeRecord getPreviousReportingManager() {
        return previousReportingManager;
    }

    public void setPreviousReportingManager(
            EmployeeRecord previousReportingManager) {

        this.previousReportingManager =
                previousReportingManager;
    }

    public EmployeeRecord getNewReportingManager() {
        return newReportingManager;
    }

    public void setNewReportingManager(
            EmployeeRecord newReportingManager) {

        this.newReportingManager =
                newReportingManager;
    }

    public EmployeeRecord getPreviousFunctionalManager() {
        return previousFunctionalManager;
    }

    public void setPreviousFunctionalManager(
            EmployeeRecord previousFunctionalManager) {

        this.previousFunctionalManager =
                previousFunctionalManager;
    }

    public EmployeeRecord getNewFunctionalManager() {
        return newFunctionalManager;
    }

    public void setNewFunctionalManager(
            EmployeeRecord newFunctionalManager) {

        this.newFunctionalManager =
                newFunctionalManager;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(
            LocalDate effectiveDate) {

        this.effectiveDate =
                effectiveDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(
            String reason) {

        this.reason = reason;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {

        this.remarks = remarks;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(
            String changedBy) {

        this.changedBy = changedBy;
    }

    public String getChangedByRole() {
        return changedByRole;
    }

    public void setChangedByRole(
            String changedByRole) {

        this.changedByRole = changedByRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}