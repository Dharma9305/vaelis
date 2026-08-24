package vaelis_api.service;

import vaelis_api.dto.EmployeeRecordCreateRequest;
import vaelis_api.dto.EmployeeRecordUpdateRequest;
import vaelis_api.entity.AdminUser;
import vaelis_api.entity.EmployeeLifecycleHistory;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.repository.EmployeeLifecycleHistoryRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class EmployeeRecordManagementService {

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_RECORDS_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_RECORDS_UPDATE";

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminUserRepository
            adminUserRepository;

    private final EmployeeLifecycleHistoryRepository
            employeeLifecycleHistoryRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    public EmployeeRecordManagementService(
            EmployeeRecordRepository employeeRecordRepository,
            AdminUserRepository adminUserRepository,
            EmployeeLifecycleHistoryRepository employeeLifecycleHistoryRepository,
            AdminActivityLogService adminActivityLogService) {

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminUserRepository =
                adminUserRepository;

        this.employeeLifecycleHistoryRepository =
                employeeLifecycleHistoryRepository;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // CREATE EMPLOYEE RECORD
    // =========================================================

    @Transactional
    public EmployeeRecord createEmployee(
            EmployeeRecordCreateRequest request,
            Authentication authentication) {

        requireCreateAccess(authentication);

        validateCreateRequest(request);

        AdminUser adminUser =
                adminUserRepository
                        .findById(request.getAdminUserId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Admin user account not found."
                                )
                        );

        if ("SUPER_ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN represents VAELIS INDIA "
                            + "and cannot have an EmployeeRecord."
            );
        }

        if (!isEmployeeRole(adminUser.getRole())) {

            throw new IllegalStateException(
                    "Employee record can only be created "
                            + "for ACCOUNT_MANAGER, ADMIN or EMPLOYEE accounts."
            );
        }

        if (adminUser.isDeleted()) {

            throw new IllegalStateException(
                    "Cannot create an employee record for a deleted account."
            );
        }

        if (!adminUser.isEnabled()) {

            throw new IllegalStateException(
                    "Cannot create an employee record for a disabled account."
            );
        }

        if (!adminUser.isApproved()) {

            throw new IllegalStateException(
                    "Cannot create an employee record for an unapproved account."
            );
        }

        if (employeeRecordRepository
                .existsByAdminUserId(
                        adminUser.getId()
                )) {

            throw new IllegalStateException(
                    "This admin user already has an employee record."
            );
        }

        String employeeCode =
                normalizeRequired(
                        request.getEmployeeCode(),
                        "Employee code"
                );

        if (employeeRecordRepository
                .existsByEmployeeCodeIgnoreCase(
                        employeeCode
                )) {

            throw new IllegalStateException(
                    "Employee code already exists: "
                            + employeeCode
            );
        }

        EmployeeRecord reportingManager =
                resolveManager(
                        request.getReportingManagerId(),
                        "Reporting manager"
                );

        EmployeeRecord functionalManager =
                resolveManager(
                        request.getFunctionalManagerId(),
                        "Functional manager"
                );

        EmployeeRecord employee =
                new EmployeeRecord();

        employee.setAdminUser(adminUser);

        employee.setEmployeeCode(employeeCode);

        employee.setFirstName(
                normalizeRequired(
                        request.getFirstName(),
                        "First name"
                )
        );

        employee.setMiddleName(
                normalizeOptional(
                        request.getMiddleName()
                )
        );

        employee.setLastName(
                normalizeOptional(
                        request.getLastName()
                )
        );

        employee.setPreferredName(
                normalizeOptional(
                        request.getPreferredName()
                )
        );

        employee.setDateOfBirth(
                request.getDateOfBirth()
        );

        employee.setGender(
                normalizeOptional(
                        request.getGender()
                )
        );

        employee.setMaritalStatus(
                normalizeOptional(
                        request.getMaritalStatus()
                )
        );

        employee.setNationality(
                normalizeOptional(
                        request.getNationality()
                )
        );

        employee.setOfficialEmail(
                normalizeOptional(
                        request.getOfficialEmail()
                )
        );

        employee.setPersonalEmail(
                normalizeOptional(
                        request.getPersonalEmail()
                )
        );

        employee.setPrimaryMobile(
                normalizeOptional(
                        request.getPrimaryMobile()
                )
        );

        employee.setAlternateMobile(
                normalizeOptional(
                        request.getAlternateMobile()
                )
        );

        employee.setDateOfJoining(
                request.getDateOfJoining()
        );

        employee.setEmploymentType(
                normalizeOptional(
                        request.getEmploymentType()
                )
        );

        employee.setEmploymentStatus(
                normalizeStatus(
                        request.getEmploymentStatus()
                )
        );

        employee.setDepartment(
                normalizeOptional(
                        request.getDepartment()
                )
        );

        employee.setDesignation(
                normalizeOptional(
                        request.getDesignation()
                )
        );

        employee.setJobTitle(
                normalizeOptional(
                        request.getJobTitle()
                )
        );

        employee.setGrade(
                normalizeOptional(
                        request.getGrade()
                )
        );

        employee.setWorkLocation(
                normalizeOptional(
                        request.getWorkLocation()
                )
        );

        employee.setBranch(
                normalizeOptional(
                        request.getBranch()
                )
        );

        employee.setWorkMode(
                normalizeOptional(
                        request.getWorkMode()
                )
        );

        employee.setReportingManager(
                reportingManager
        );

        employee.setFunctionalManager(
                functionalManager
        );

        employee.setProfileStatus(
                "ACTIVE"
        );

        EmployeeRecord saved =
                employeeRecordRepository.save(
                        employee
                );

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_CREATE",
                adminUser.getId(),
                adminUser.getUsername(),
                adminUser.getRole(),
                "Employee record created. "
                        + "Employee code: "
                        + saved.getEmployeeCode()
                        + ". Employee record ID: "
                        + saved.getId(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE EMPLOYEE RECORD
    // =========================================================

    @Transactional
    public EmployeeRecord updateEmployee(
            Long employeeId,
            EmployeeRecordUpdateRequest request,
            Authentication authentication) {

        requireUpdateAccess(authentication);

        validateUpdateRequest(request);

        EmployeeRecord employee =
                employeeRecordRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Employee record not found."
                                )
                        );

        // =====================================================
        // CAPTURE PREVIOUS LIFECYCLE STATE
        // =====================================================

        String previousStatus =
                employee.getEmploymentStatus();

        String previousDepartment =
                employee.getDepartment();

        String previousDesignation =
                employee.getDesignation();

        EmployeeRecord previousReportingManager =
                employee.getReportingManager();

        EmployeeRecord previousFunctionalManager =
                employee.getFunctionalManager();

        // =====================================================
        // LINKED ACCOUNT MUST REMAIN INTACT
        // =====================================================

        if (employee.getAdminUser() == null) {

            throw new IllegalStateException(
                    "Employee record is not linked to an admin user account."
            );
        }

        AdminUser adminUser =
                employee.getAdminUser();

        if ("SUPER_ADMIN".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN represents VAELIS INDIA "
                            + "and cannot have an EmployeeRecord."
            );
        }

        if (adminUser.isDeleted()) {

            throw new IllegalStateException(
                    "Cannot update an employee record linked to a deleted account."
            );
        }

        // =====================================================
        // EMPLOYEE CODE
        // =====================================================

        String employeeCode =
                normalizeRequired(
                        request.getEmployeeCode(),
                        "Employee code"
                );

        if (!employeeCode.equalsIgnoreCase(
                employee.getEmployeeCode()
        )
                && employeeRecordRepository
                .existsByEmployeeCodeIgnoreCase(
                        employeeCode
                )) {

            throw new IllegalStateException(
                    "Employee code already exists: "
                            + employeeCode
            );
        }

        // =====================================================
        // MANAGER SELF-REFERENCE PROTECTION
        // =====================================================

        if (employeeId.equals(
                request.getReportingManagerId()
        )) {

            throw new IllegalStateException(
                    "An employee cannot be their own reporting manager."
            );
        }

        if (employeeId.equals(
                request.getFunctionalManagerId()
        )) {

            throw new IllegalStateException(
                    "An employee cannot be their own functional manager."
            );
        }

        // =====================================================
        // RESOLVE MANAGERS
        // =====================================================

        EmployeeRecord reportingManager =
                resolveManager(
                        request.getReportingManagerId(),
                        "Reporting manager"
                );

        EmployeeRecord functionalManager =
                resolveManager(
                        request.getFunctionalManagerId(),
                        "Functional manager"
                );

        // =====================================================
        // PERSONAL IDENTITY
        // =====================================================

        employee.setEmployeeCode(
                employeeCode
        );

        employee.setFirstName(
                normalizeRequired(
                        request.getFirstName(),
                        "First name"
                )
        );

        employee.setMiddleName(
                normalizeOptional(
                        request.getMiddleName()
                )
        );

        employee.setLastName(
                normalizeOptional(
                        request.getLastName()
                )
        );

        employee.setPreferredName(
                normalizeOptional(
                        request.getPreferredName()
                )
        );

        employee.setDateOfBirth(
                request.getDateOfBirth()
        );

        employee.setGender(
                normalizeOptional(
                        request.getGender()
                )
        );

        employee.setMaritalStatus(
                normalizeOptional(
                        request.getMaritalStatus()
                )
        );

        employee.setNationality(
                normalizeOptional(
                        request.getNationality()
                )
        );

        // =====================================================
        // CONTACT
        // =====================================================

        employee.setOfficialEmail(
                normalizeOptional(
                        request.getOfficialEmail()
                )
        );

        employee.setPersonalEmail(
                normalizeOptional(
                        request.getPersonalEmail()
                )
        );

        employee.setPrimaryMobile(
                normalizeOptional(
                        request.getPrimaryMobile()
                )
        );

        employee.setAlternateMobile(
                normalizeOptional(
                        request.getAlternateMobile()
                )
        );

        // =====================================================
        // EMPLOYMENT
        // =====================================================

        employee.setDateOfJoining(
                request.getDateOfJoining()
        );

        employee.setEmploymentType(
                normalizeOptional(
                        request.getEmploymentType()
                )
        );

        employee.setEmploymentStatus(
                normalizeStatus(
                        request.getEmploymentStatus()
                )
        );

        employee.setDepartment(
                normalizeOptional(
                        request.getDepartment()
                )
        );

        employee.setDesignation(
                normalizeOptional(
                        request.getDesignation()
                )
        );

        employee.setJobTitle(
                normalizeOptional(
                        request.getJobTitle()
                )
        );

        employee.setGrade(
                normalizeOptional(
                        request.getGrade()
                )
        );

        employee.setWorkLocation(
                normalizeOptional(
                        request.getWorkLocation()
                )
        );

        employee.setBranch(
                normalizeOptional(
                        request.getBranch()
                )
        );

        employee.setWorkMode(
                normalizeOptional(
                        request.getWorkMode()
                )
        );

        // =====================================================
        // REPORTING
        // =====================================================

        employee.setReportingManager(
                reportingManager
        );

        employee.setFunctionalManager(
                functionalManager
        );

        // =====================================================
        // PROFILE STATUS
        // =====================================================

        employee.setProfileStatus(
                normalizeProfileStatus(
                        request.getProfileStatus()
                )
        );

        // =====================================================
        // SAVE
        // =====================================================

        EmployeeRecord saved =
                employeeRecordRepository.save(
                        employee
                );

        // =====================================================
        // LIFECYCLE HISTORY
        // =====================================================

        createLifecycleHistory(
                saved,
                previousStatus,
                previousDepartment,
                previousDesignation,
                previousReportingManager,
                previousFunctionalManager,
                authentication
        );

        // =====================================================
        // AUDIT
        // =====================================================

        adminActivityLogService.log(
                "EMPLOYEE_RECORD_UPDATE",
                adminUser.getId(),
                adminUser.getUsername(),
                adminUser.getRole(),
                "Employee record updated. "
                        + "Employee code: "
                        + saved.getEmployeeCode()
                        + ". Employee record ID: "
                        + saved.getId(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // CREATE LIFECYCLE HISTORY
    // =========================================================

    private void createLifecycleHistory(
            EmployeeRecord employee,
            String previousStatus,
            String previousDepartment,
            String previousDesignation,
            EmployeeRecord previousReportingManager,
            EmployeeRecord previousFunctionalManager,
            Authentication authentication) {

        String newStatus =
                employee.getEmploymentStatus();

        String newDepartment =
                employee.getDepartment();

        String newDesignation =
                employee.getDesignation();

        EmployeeRecord newReportingManager =
                employee.getReportingManager();

        EmployeeRecord newFunctionalManager =
                employee.getFunctionalManager();

        boolean statusChanged =
                !sameValue(
                        previousStatus,
                        newStatus
                );

        boolean departmentChanged =
                !sameValue(
                        previousDepartment,
                        newDepartment
                );

        boolean designationChanged =
                !sameValue(
                        previousDesignation,
                        newDesignation
                );

        boolean reportingManagerChanged =
                !sameEmployee(
                        previousReportingManager,
                        newReportingManager
                );

        boolean functionalManagerChanged =
                !sameEmployee(
                        previousFunctionalManager,
                        newFunctionalManager
                );

        // =====================================================
        // NOTHING LIFECYCLE-RELEVANT CHANGED
        // =====================================================

        if (!statusChanged
                && !departmentChanged
                && !designationChanged
                && !reportingManagerChanged
                && !functionalManagerChanged) {

            return;
        }

        // =====================================================
        // DETERMINE EVENT TYPE
        // =====================================================

        String eventType;

        if (statusChanged
                && !departmentChanged
                && !designationChanged
                && !reportingManagerChanged
                && !functionalManagerChanged) {

            eventType = "STATUS_CHANGE";

        } else if (!statusChanged
                && departmentChanged
                && !designationChanged
                && !reportingManagerChanged
                && !functionalManagerChanged) {

            eventType = "DEPARTMENT_CHANGE";

        } else if (!statusChanged
                && !departmentChanged
                && designationChanged
                && !reportingManagerChanged
                && !functionalManagerChanged) {

            eventType = "DESIGNATION_CHANGE";

        } else if (!statusChanged
                && !departmentChanged
                && !designationChanged
                && reportingManagerChanged
                && !functionalManagerChanged) {

            eventType = "REPORTING_MANAGER_CHANGE";

        } else if (!statusChanged
                && !departmentChanged
                && !designationChanged
                && !reportingManagerChanged
                && functionalManagerChanged) {

            eventType = "FUNCTIONAL_MANAGER_CHANGE";

        } else {

            eventType = "ORGANIZATION_CHANGE";
        }

        // =====================================================
        // CREATE HISTORY
        // =====================================================

        EmployeeLifecycleHistory history =
                new EmployeeLifecycleHistory();

        history.setEmployee(
                employee
        );

        history.setEventType(
                eventType
        );

        // =====================================================
        // STATUS
        // =====================================================

        if (statusChanged) {

            history.setPreviousStatus(
                    previousStatus
            );

            history.setNewStatus(
                    newStatus
            );
        }

        // =====================================================
        // DEPARTMENT
        // =====================================================

        if (departmentChanged) {

            history.setPreviousDepartment(
                    previousDepartment
            );

            history.setNewDepartment(
                    newDepartment
            );
        }

        // =====================================================
        // DESIGNATION
        // =====================================================

        if (designationChanged) {

            history.setPreviousDesignation(
                    previousDesignation
            );

            history.setNewDesignation(
                    newDesignation
            );
        }

        // =====================================================
        // REPORTING MANAGER
        // =====================================================

        if (reportingManagerChanged) {

            history.setPreviousReportingManager(
                    previousReportingManager
            );

            history.setNewReportingManager(
                    newReportingManager
            );
        }

        // =====================================================
        // FUNCTIONAL MANAGER
        // =====================================================

        if (functionalManagerChanged) {

            history.setPreviousFunctionalManager(
                    previousFunctionalManager
            );

            history.setNewFunctionalManager(
                    newFunctionalManager
            );
        }

        // =====================================================
        // EFFECTIVE DATE
        // =====================================================

        history.setEffectiveDate(
                LocalDate.now()
        );

        // =====================================================
        // REASON
        // =====================================================

        history.setReason(
                buildLifecycleReason(
                        statusChanged,
                        departmentChanged,
                        designationChanged,
                        reportingManagerChanged,
                        functionalManagerChanged
                )
        );

        // =====================================================
        // REMARKS
        // =====================================================

        history.setRemarks(
                "Employee record updated through "
                        + "employee management."
        );

        // =====================================================
        // ACTOR
        // =====================================================

        if (authentication != null) {

            history.setChangedBy(
                    authentication.getName()
            );

            history.setChangedByRole(
                    resolveAuthenticatedRole(
                            authentication
                    )
            );
        }

        employeeLifecycleHistoryRepository.save(
                history
        );
    }

    // =========================================================
    // LIFECYCLE REASON
    // =========================================================

    private String buildLifecycleReason(
            boolean statusChanged,
            boolean departmentChanged,
            boolean designationChanged,
            boolean reportingManagerChanged,
            boolean functionalManagerChanged) {

        StringBuilder reason =
                new StringBuilder(
                        "Employee lifecycle updated: "
                );

        boolean first = true;

        if (statusChanged) {

            reason.append(
                    "employment status"
            );

            first = false;
        }

        if (departmentChanged) {

            if (!first) {
                reason.append(", ");
            }

            reason.append(
                    "department"
            );

            first = false;
        }

        if (designationChanged) {

            if (!first) {
                reason.append(", ");
            }

            reason.append(
                    "designation"
            );

            first = false;
        }

        if (reportingManagerChanged) {

            if (!first) {
                reason.append(", ");
            }

            reason.append(
                    "reporting manager"
            );

            first = false;
        }

        if (functionalManagerChanged) {

            if (!first) {
                reason.append(", ");
            }

            reason.append(
                    "functional manager"
            );
        }

        return reason.toString();
    }

    // =========================================================
    // AUTHENTICATED ROLE
    // =========================================================

    private String resolveAuthenticatedRole(
            Authentication authentication) {

        if (authentication == null ||
                authentication.getAuthorities() == null) {

            return null;
        }

        return authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority ->
                        authority != null &&
                        authority.startsWith("ROLE_")
                )
                .map(authority ->
                        authority.substring(
                                "ROLE_".length()
                        )
                )
                .findFirst()
                .orElse(null);
    }

    // =========================================================
    // VALUE COMPARISON
    // =========================================================

    private boolean sameValue(
            String first,
            String second) {

        if (first == null &&
                second == null) {

            return true;
        }

        if (first == null ||
                second == null) {

            return false;
        }

        return first.equalsIgnoreCase(
                second
        );
    }

    // =========================================================
    // EMPLOYEE COMPARISON
    // =========================================================

    private boolean sameEmployee(
            EmployeeRecord first,
            EmployeeRecord second) {

        if (first == null &&
                second == null) {

            return true;
        }

        if (first == null ||
                second == null) {

            return false;
        }

        if (first.getId() == null ||
                second.getId() == null) {

            return first == second;
        }

        return first.getId().equals(
                second.getId()
        );
    }

    // =========================================================
    // CREATE ACCESS
    // =========================================================

    private void requireCreateAccess(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AdminPermissionDeniedException(
                    "Authentication is required."
            );
        }

        boolean superAdmin =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_SUPER_ADMIN".equals(
                                        authority.getAuthority()
                                )
                        );

        if (superAdmin) {
            return;
        }

        boolean permitted =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(
                                CREATE_PERMISSION::equals
                        );

        if (!permitted) {

            adminActivityLogService.log(
                    "EMPLOYEE_RECORD_CREATE_ACCESS_DENIED",
                    null,
                    null,
                    "EMPLOYEE",
                    "Employee record creation denied. "
                            + "Required permission: "
                            + CREATE_PERMISSION
                            + ". Actor: "
                            + authentication.getName(),
                    "DENIED"
            );

            throw new AdminPermissionDeniedException(
                    "You do not have permission to create employee records."
            );
        }
    }

    // =========================================================
    // UPDATE ACCESS
    // =========================================================

    private void requireUpdateAccess(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AdminPermissionDeniedException(
                    "Authentication is required."
            );
        }

        boolean superAdmin =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_SUPER_ADMIN".equals(
                                        authority.getAuthority()
                                )
                        );

        if (superAdmin) {
            return;
        }

        boolean permitted =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(
                                UPDATE_PERMISSION::equals
                        );

        if (!permitted) {

            adminActivityLogService.log(
                    "EMPLOYEE_RECORD_UPDATE_ACCESS_DENIED",
                    null,
                    null,
                    "EMPLOYEE",
                    "Employee record update denied. "
                            + "Required permission: "
                            + UPDATE_PERMISSION
                            + ". Actor: "
                            + authentication.getName(),
                    "DENIED"
            );

            throw new AdminPermissionDeniedException(
                    "You do not have permission to update employee records."
            );
        }
    }

    // =========================================================
    // CREATE REQUEST VALIDATION
    // =========================================================

    private void validateCreateRequest(
            EmployeeRecordCreateRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Employee creation request is required."
            );
        }

        if (request.getAdminUserId() == null) {

            throw new IllegalArgumentException(
                    "Admin user ID is required."
            );
        }
    }

    // =========================================================
    // UPDATE REQUEST VALIDATION
    // =========================================================

    private void validateUpdateRequest(
            EmployeeRecordUpdateRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Employee update request is required."
            );
        }
    }

    // =========================================================
    // EMPLOYEE ROLE CHECK
    // =========================================================

    private boolean isEmployeeRole(
            String role) {

        return "ACCOUNT_MANAGER".equalsIgnoreCase(role)
                || "ADMIN".equalsIgnoreCase(role)
                || "EMPLOYEE".equalsIgnoreCase(role);
    }

    // =========================================================
    // MANAGER RESOLUTION
    // =========================================================

    private EmployeeRecord resolveManager(
            Long managerId,
            String label) {

        if (managerId == null) {
            return null;
        }

        EmployeeRecord manager =
                employeeRecordRepository
                        .findById(managerId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        label
                                                + " employee record not found."
                                )
                        );

        return manager;
    }

    // =========================================================
    // REQUIRED STRING
    // =========================================================

    private String normalizeRequired(
            String value,
            String fieldName) {

        if (value == null ||
                value.isBlank()) {

            throw new IllegalArgumentException(
                    fieldName + " is required."
            );
        }

        return value.trim();
    }

    // =========================================================
    // OPTIONAL STRING
    // =========================================================

    private String normalizeOptional(
            String value) {

        if (value == null ||
                value.isBlank()) {

            return null;
        }

        return value.trim();
    }

    // =========================================================
    // EMPLOYMENT STATUS
    // =========================================================

    private String normalizeStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            return "ACTIVE";
        }

        return status
                .trim()
                .toUpperCase();
    }

    // =========================================================
    // PROFILE STATUS
    // =========================================================

    private String normalizeProfileStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            return "ACTIVE";
        }

        return status
                .trim()
                .toUpperCase();
    }
}