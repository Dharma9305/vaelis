package vaelis_api.service;

import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeRecordAccessService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_RECORDS_VIEW";

    private final EmployeeRecordRepository employeeRecordRepository;
    private final AdminActivityLogService adminActivityLogService;

    public EmployeeRecordAccessService(
            EmployeeRecordRepository employeeRecordRepository,
            AdminActivityLogService adminActivityLogService) {

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // CHECK ACCESS
    // =========================================================

    private boolean hasViewAccess(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        // =====================================================
        // SUPER ADMIN = VAELIS INDIA
        // =====================================================

        boolean superAdmin =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_SUPER_ADMIN"
                                        .equals(
                                                authority.getAuthority()
                                        )
                        );

        if (superAdmin) {
            return true;
        }

        // =====================================================
        // EXPLICIT EMPLOYEE RECORD PERMISSION
        // =====================================================

        return authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(
                        VIEW_PERMISSION::equals
                );
    }

    // =========================================================
    // GET ALL EMPLOYEE RECORDS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeRecord> getAllEmployees(
            Authentication authentication) {

        requireViewAccess(authentication);

        List<EmployeeRecord> employees =
                employeeRecordRepository
                        .findAllByOrderByCreatedAtDesc();

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_LIST_VIEW",
                null,
                null,
                "EMPLOYEE",
                "Employee record directory viewed. "
                        + "Records returned: "
                        + employees.size(),
                "SUCCESS"
        );

        return employees;
    }

    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeRecord getEmployeeById(
            Long employeeId,
            Authentication authentication) {

        requireViewAccess(authentication);

        EmployeeRecord employee =
                employeeRecordRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Employee record not found."
                                )
                        );

        auditEmployeeView(
                employee,
                "Employee record viewed."
        );

        return employee;
    }

    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeRecord getEmployeeByCode(
            String employeeCode,
            Authentication authentication) {

        requireViewAccess(authentication);

        EmployeeRecord employee =
                employeeRecordRepository
                        .findByEmployeeCodeIgnoreCase(
                                employeeCode
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Employee record not found."
                                )
                        );

        auditEmployeeView(
                employee,
                "Employee record viewed by employee code."
        );

        return employee;
    }

    // =========================================================
    // GET BY DEPARTMENT
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeRecord> getByDepartment(
            String department,
            Authentication authentication) {

        requireViewAccess(authentication);

        List<EmployeeRecord> employees =
                employeeRecordRepository
                        .findByDepartmentIgnoreCaseOrderByCreatedAtDesc(
                                department
                        );

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_DEPARTMENT_VIEW",
                null,
                department,
                "EMPLOYEE",
                "Employee records viewed for department: "
                        + department
                        + ". Records returned: "
                        + employees.size(),
                "SUCCESS"
        );

        return employees;
    }

    // =========================================================
    // GET BY EMPLOYMENT STATUS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeRecord> getByEmploymentStatus(
            String employmentStatus,
            Authentication authentication) {

        requireViewAccess(authentication);

        List<EmployeeRecord> employees =
                employeeRecordRepository
                        .findByEmploymentStatusIgnoreCaseOrderByCreatedAtDesc(
                                employmentStatus
                        );

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_STATUS_VIEW",
                null,
                employmentStatus,
                "EMPLOYEE",
                "Employee records viewed for employment status: "
                        + employmentStatus
                        + ". Records returned: "
                        + employees.size(),
                "SUCCESS"
        );

        return employees;
    }

    // =========================================================
    // AUDIT INDIVIDUAL EMPLOYEE VIEW
    // =========================================================

    private void auditEmployeeView(
            EmployeeRecord employee,
            String details) {

        String targetUsername = null;

        if (employee.getAdminUser() != null) {

            targetUsername =
                    employee
                            .getAdminUser()
                            .getUsername();
        }

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_VIEW",
                employee.getId(),
                targetUsername,
                "EMPLOYEE",
                details
                        + " Employee code: "
                        + employee.getEmployeeCode(),
                "SUCCESS"
        );
    }

    // =========================================================
    // ACCESS DENIED
    // =========================================================

    private void requireViewAccess(
            Authentication authentication) {

        if (hasViewAccess(authentication)) {
            return;
        }

        String actorUsername =
                authentication != null
                        ? authentication.getName()
                        : "UNKNOWN";

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_ACCESS_DENIED",
                null,
                null,
                "EMPLOYEE",
                "Employee record access denied. "
                        + "Required permission: "
                        + VIEW_PERMISSION
                        + ". Actor: "
                        + actorUsername,
                "DENIED"
        );

        throw new AdminPermissionDeniedException(
                "You do not have permission to view employee records."
        );
    }
}