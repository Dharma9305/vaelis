package vaelis_api.service;

import vaelis_api.dto.EmployeeEmploymentHistoryRequest;
import vaelis_api.entity.EmployeeEmploymentHistory;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeEmploymentHistoryRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EmployeeEmploymentHistoryManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_EMPLOYMENT_HISTORY_VIEW";

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_EMPLOYMENT_HISTORY_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_EMPLOYMENT_HISTORY_UPDATE";

    private static final String DELETE_PERMISSION =
            "EMPLOYEE_EMPLOYMENT_HISTORY_DELETE";

    private final EmployeeEmploymentHistoryRepository
            employmentHistoryRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminAuthorizationService
            adminAuthorizationService;

    private final AdminActivityLogService
            adminActivityLogService;

    public EmployeeEmploymentHistoryManagementService(
            EmployeeEmploymentHistoryRepository
                    employmentHistoryRepository,
            EmployeeRecordRepository
                    employeeRecordRepository,
            AdminAuthorizationService
                    adminAuthorizationService,
            AdminActivityLogService
                    adminActivityLogService) {

        this.employmentHistoryRepository =
                employmentHistoryRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminAuthorizationService =
                adminAuthorizationService;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEmploymentHistory>
    getAllHistory(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEmploymentHistory> history =
                employmentHistoryRepository
                        .findByEmployeeIdOrderByStartDateDesc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_EMPLOYMENT_HISTORY_LIST_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Employment history viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + history.size(),
                "SUCCESS"
        );

        return history;
    }

    // =========================================================
    // GET ACTIVE
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEmploymentHistory>
    getActiveHistory(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEmploymentHistory> history =
                employmentHistoryRepository
                        .findByEmployeeIdAndActiveTrueOrderByStartDateDesc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_ACTIVE_EMPLOYMENT_HISTORY_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Active employment history viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + history.size(),
                "SUCCESS"
        );

        return history;
    }

    // =========================================================
    // GET SINGLE
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeEmploymentHistory
    getHistory(
            Long employeeId,
            Long historyId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEmploymentHistory history =
                findHistory(
                        employeeId,
                        historyId
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMPLOYMENT_HISTORY_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Employment history viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". History ID: "
                        + history.getId(),
                "SUCCESS"
        );

        return history;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public EmployeeEmploymentHistory
    createHistory(
            Long employeeId,
            EmployeeEmploymentHistoryRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        EmployeeEmploymentHistory history =
                new EmployeeEmploymentHistory();

        history.setEmployee(employee);

        applyRequest(
                history,
                request,
                true
        );

        EmployeeEmploymentHistory saved =
                employmentHistoryRepository.save(
                        history
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMPLOYMENT_HISTORY_CREATE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Employment history created. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". History ID: "
                        + saved.getId()
                        + ". Company: "
                        + saved.getCompanyName(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public EmployeeEmploymentHistory
    updateHistory(
            Long employeeId,
            Long historyId,
            EmployeeEmploymentHistoryRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEmploymentHistory history =
                findHistory(
                        employeeId,
                        historyId
                );

        validateRequest(request);

        applyRequest(
                history,
                request,
                history.isActive()
        );

        EmployeeEmploymentHistory updated =
                employmentHistoryRepository.save(
                        history
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMPLOYMENT_HISTORY_UPDATE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Employment history updated. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". History ID: "
                        + updated.getId(),
                "SUCCESS"
        );

        return updated;
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void deleteHistory(
            Long employeeId,
            Long historyId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEmploymentHistory history =
                findHistory(
                        employeeId,
                        historyId
                );

        Long id =
                history.getId();

        String companyName =
                history.getCompanyName();

        employmentHistoryRepository.delete(
                history
        );

        adminActivityLogService.log(
                "EMPLOYEE_EMPLOYMENT_HISTORY_DELETE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Employment history deleted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". History ID: "
                        + id
                        + ". Company: "
                        + companyName,
                "SUCCESS"
        );
    }

    // =========================================================
    // FIND EMPLOYEE
    // =========================================================

    private EmployeeRecord findEmployee(
            Long employeeId) {

        if (employeeId == null) {

            throw new IllegalArgumentException(
                    "Employee ID is required."
            );
        }

        return employeeRecordRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee record not found."
                        )
                );
    }

    // =========================================================
    // FIND HISTORY
    // =========================================================

    private EmployeeEmploymentHistory findHistory(
            Long employeeId,
            Long historyId) {

        if (historyId == null) {

            throw new IllegalArgumentException(
                    "Employment history ID is required."
            );
        }

        EmployeeEmploymentHistory history =
                employmentHistoryRepository
                        .findById(historyId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Employment history not found."
                                )
                        );

        if (history.getEmployee() == null ||
                history.getEmployee().getId() == null ||
                !history.getEmployee()
                        .getId()
                        .equals(employeeId)) {

            throw new IllegalArgumentException(
                    "Employment history does not belong to this employee."
            );
        }

        return history;
    }

    // =========================================================
    // VALIDATE REQUEST
    // =========================================================

    private void validateRequest(
            EmployeeEmploymentHistoryRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Employment history request is required."
            );
        }

        requireText(
                request.getCompanyName(),
                "Company name is required."
        );

        requireText(
                request.getJobTitle(),
                "Job title is required."
        );

        if (request.getStartDate() != null &&
                request.getEndDate() != null &&
                request.getEndDate()
                        .isBefore(
                                request.getStartDate()
                        )) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }

        if (request.getLastDrawnSalary() != null &&
                request.getLastDrawnSalary()
                        .compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Last drawn salary cannot be negative."
            );
        }
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeEmploymentHistory history,
            EmployeeEmploymentHistoryRequest request,
            boolean defaultActive) {

        history.setCompanyName(
                request.getCompanyName().trim()
        );

        history.setCompanyLocation(
                normalizeNullable(
                        request.getCompanyLocation()
                )
        );

        history.setIndustry(
                normalizeNullable(
                        request.getIndustry()
                )
        );

        history.setJobTitle(
                request.getJobTitle().trim()
        );

        history.setDesignation(
                normalizeNullable(
                        request.getDesignation()
                )
        );

        history.setDepartment(
                normalizeNullable(
                        request.getDepartment()
                )
        );

        history.setEmploymentType(
                normalizeNullable(
                        request.getEmploymentType()
                )
        );

        history.setStartDate(
                request.getStartDate()
        );

        history.setEndDate(
                request.getEndDate()
        );

        history.setLastDrawnDesignation(
                normalizeNullable(
                        request.getLastDrawnDesignation()
                )
        );

        history.setLastDrawnSalary(
                request.getLastDrawnSalary()
        );

        history.setReasonForLeaving(
                normalizeNullable(
                        request.getReasonForLeaving()
                )
        );

        history.setReportingManager(
                normalizeNullable(
                        request.getReportingManager()
                )
        );

        history.setHrContactName(
                normalizeNullable(
                        request.getHrContactName()
                )
        );

        history.setHrContactEmail(
                normalizeNullable(
                        request.getHrContactEmail()
                )
        );

        history.setHrContactMobile(
                normalizeNullable(
                        request.getHrContactMobile()
                )
        );

        history.setVerificationStatus(
                normalizeVerificationStatus(
                        request.getVerificationStatus()
                )
        );

        history.setVerificationReference(
                normalizeNullable(
                        request.getVerificationReference()
                )
        );

        if (request.getActive() != null) {

            history.setActive(
                    request.getActive()
            );

        } else {

            history.setActive(
                    defaultActive
            );
        }
    }

    // =========================================================
    // VERIFICATION STATUS
    // =========================================================

    private String normalizeVerificationStatus(
            String status) {

        if (status == null ||
                status.trim().isEmpty()) {

            return "PENDING";
        }

        String value =
                status.trim()
                        .toUpperCase();

        if (!"PENDING".equals(value) &&
                !"VERIFIED".equals(value) &&
                !"REJECTED".equals(value)) {

            throw new IllegalArgumentException(
                    "Invalid verification status. "
                            + "Allowed values: PENDING, VERIFIED, REJECTED."
            );
        }

        return value;
    }

    // =========================================================
    // REQUIRED TEXT
    // =========================================================

    private void requireText(
            String value,
            String message) {

        if (value == null ||
                value.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    message
            );
        }
    }

    // =========================================================
    // NULLABLE TEXT
    // =========================================================

    private String normalizeNullable(
            String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            return null;
        }

        return value.trim();
    }

    // =========================================================
    // TARGET USERNAME
    // =========================================================

    private String getTargetUsername(
            EmployeeRecord employee) {

        if (employee.getAdminUser() == null) {
            return null;
        }

        return employee
                .getAdminUser()
                .getUsername();
    }

    // =========================================================
    // PERMISSION
    // =========================================================

    private void requirePermission(
            Authentication authentication,
            String permission) {

        try {

            adminAuthorizationService
                    .requirePermission(
                            authentication,
                            permission
                    );

        } catch (AdminPermissionDeniedException ex) {

            String actorUsername =
                    authentication != null
                            ? authentication.getName()
                            : "UNKNOWN";

            adminActivityLogService.log(
                    "EMPLOYEE_EMPLOYMENT_HISTORY_ACCESS_DENIED",
                    null,
                    null,
                    "EMPLOYEE",
                    "Employee employment history access denied. "
                            + "Required permission: "
                            + permission
                            + ". Actor: "
                            + actorUsername,
                    "DENIED"
            );

            throw ex;
        }
    }
}