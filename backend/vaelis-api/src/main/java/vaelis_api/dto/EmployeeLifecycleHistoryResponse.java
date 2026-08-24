package vaelis_api.dto;

import vaelis_api.entity.EmployeeLifecycleHistory;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeLifecycleHistoryResponse {

    // =========================================================
    // ID
    // =========================================================

    private Long id;
    private Long employeeId;

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
    // AUDIT
    // =========================================================

    private String changedBy;
    private String changedByRole;

    private LocalDateTime createdAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeLifecycleHistoryResponse() {
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    public static EmployeeLifecycleHistoryResponse fromEntity(
            EmployeeLifecycleHistory entity) {

        EmployeeLifecycleHistoryResponse response =
                new EmployeeLifecycleHistoryResponse();

        response.id = entity.getId();

        if (entity.getEmployee() != null) {
            response.employeeId =
                    entity.getEmployee().getId();
        }

        response.eventType =
                entity.getEventType();

        response.effectiveDate =
                entity.getEffectiveDate();

        response.previousDepartment =
                entity.getPreviousDepartment();

        response.newDepartment =
                entity.getNewDepartment();

        response.previousDesignation =
                entity.getPreviousDesignation();

        response.newDesignation =
                entity.getNewDesignation();

        response.previousStatus =
                entity.getPreviousStatus();

        response.newStatus =
                entity.getNewStatus();

        response.previousReportingManagerId =
                entity.getPreviousReportingManager() != null
                        ? entity.getPreviousReportingManager().getId()
                        : null;

        response.newReportingManagerId =
                entity.getNewReportingManager() != null
                        ? entity.getNewReportingManager().getId()
                        : null;

        response.previousFunctionalManagerId =
                entity.getPreviousFunctionalManager() != null
                        ? entity.getPreviousFunctionalManager().getId()
                        : null;

        response.newFunctionalManagerId =
                entity.getNewFunctionalManager() != null
                        ? entity.getNewFunctionalManager().getId()
                        : null;

        response.reason =
                entity.getReason();

        response.remarks =
                entity.getRemarks();

        response.changedBy =
                entity.getChangedBy();

        response.changedByRole =
                entity.getChangedByRole();

        response.createdAt =
                entity.getCreatedAt();

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

    public String getEventType() {
        return eventType;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public String getPreviousDepartment() {
        return previousDepartment;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public String getPreviousDesignation() {
        return previousDesignation;
    }

    public String getNewDesignation() {
        return newDesignation;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public Long getPreviousReportingManagerId() {
        return previousReportingManagerId;
    }

    public Long getNewReportingManagerId() {
        return newReportingManagerId;
    }

    public Long getPreviousFunctionalManagerId() {
        return previousFunctionalManagerId;
    }

    public Long getNewFunctionalManagerId() {
        return newFunctionalManagerId;
    }

    public String getReason() {
        return reason;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public String getChangedByRole() {
        return changedByRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}