package vaelis_api.service;

import vaelis_api.dto.EmployeeLifecycleHistoryRequest;
import vaelis_api.entity.AdminUser;
import vaelis_api.entity.EmployeeLifecycleHistory;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.repository.EmployeeLifecycleHistoryRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeLifecycleHistoryManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_LIFECYCLE_HISTORY_VIEW";

    private final EmployeeLifecycleHistoryRepository
            lifecycleHistoryRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminUserRepository
            adminUserRepository;

    private final AdminAuthorizationService
            adminAuthorizationService;

    public EmployeeLifecycleHistoryManagementService(
            EmployeeLifecycleHistoryRepository lifecycleHistoryRepository,
            EmployeeRecordRepository employeeRecordRepository,
            AdminUserRepository adminUserRepository,
            AdminAuthorizationService adminAuthorizationService) {

        this.lifecycleHistoryRepository =
                lifecycleHistoryRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminUserRepository =
                adminUserRepository;

        this.adminAuthorizationService =
                adminAuthorizationService;
    }

    // =========================================================
    // RECORD LIFECYCLE CHANGE
    // =========================================================

    @Transactional
    public EmployeeLifecycleHistory recordChange(
            EmployeeRecord employee,
            String eventType,
            String previousStatus,
            String newStatus,
            String previousDepartment,
            String newDepartment,
            String previousDesignation,
            String newDesignation,
            EmployeeRecord previousReportingManager,
            EmployeeRecord newReportingManager,
            EmployeeRecord previousFunctionalManager,
            EmployeeRecord newFunctionalManager,
            LocalDate effectiveDate,
            String reason,
            String remarks,
            Authentication authentication) {

        if (employee == null) {
            throw new IllegalArgumentException(
                    "Employee record is required."
            );
        }

        AdminUser adminUser =
                resolveAdminUser(authentication);

        EmployeeLifecycleHistory history =
                new EmployeeLifecycleHistory();

        history.setEmployee(employee);

        history.setEventType(
                normalizeEventType(eventType)
        );

        history.setPreviousStatus(
                normalizeOptional(previousStatus)
        );

        history.setNewStatus(
                normalizeOptional(newStatus)
        );

        history.setPreviousDepartment(
                normalizeOptional(previousDepartment)
        );

        history.setNewDepartment(
                normalizeOptional(newDepartment)
        );

        history.setPreviousDesignation(
                normalizeOptional(previousDesignation)
        );

        history.setNewDesignation(
                normalizeOptional(newDesignation)
        );

        history.setPreviousReportingManager(
                previousReportingManager
        );

        history.setNewReportingManager(
                newReportingManager
        );

        history.setPreviousFunctionalManager(
                previousFunctionalManager
        );

        history.setNewFunctionalManager(
                newFunctionalManager
        );

        history.setEffectiveDate(
                effectiveDate != null
                        ? effectiveDate
                        : LocalDate.now()
        );

        history.setReason(
                normalizeOptional(reason)
        );

        history.setRemarks(
                normalizeOptional(remarks)
        );

        history.setChangedBy(
                adminUser.getUsername()
        );

        history.setChangedByRole(
                adminUser.getRole()
        );

        return lifecycleHistoryRepository.save(history);
    }

    // =========================================================
    // RECORD FROM REQUEST
    // =========================================================

    @Transactional
    public EmployeeLifecycleHistory recordChange(
            EmployeeRecord employee,
            EmployeeLifecycleHistoryRequest request,
            Authentication authentication) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Lifecycle history request is required."
            );
        }

        return recordChange(
                employee,
                request.getEventType(),
                request.getPreviousStatus(),
                request.getNewStatus(),
                request.getPreviousDepartment(),
                request.getNewDepartment(),
                request.getPreviousDesignation(),
                request.getNewDesignation(),
                resolveEmployee(
                        request.getPreviousReportingManagerId()
                ),
                resolveEmployee(
                        request.getNewReportingManagerId()
                ),
                resolveEmployee(
                        request.getPreviousFunctionalManagerId()
                ),
                resolveEmployee(
                        request.getNewFunctionalManagerId()
                ),
                request.getEffectiveDate(),
                request.getReason(),
                request.getRemarks(),
                authentication
        );
    }

    // =========================================================
    // GET ALL HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeLifecycleHistory>
    getAllHistory(
            Long employeeId,
            Authentication authentication) {

        requireViewAccess(authentication);

        requireEmployeeExists(employeeId);

        return lifecycleHistoryRepository
                .findByEmployeeIdOrderByEffectiveDateDescCreatedAtDesc(
                        employeeId
                );
    }

    // =========================================================
    // GET HISTORY BY EVENT TYPE
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeLifecycleHistory>
    getHistoryByEventType(
            Long employeeId,
            String eventType,
            Authentication authentication) {

        requireViewAccess(authentication);

        requireEmployeeExists(employeeId);

        String normalizedEventType =
                normalizeRequired(
                        eventType,
                        "Event type is required."
                );

        return lifecycleHistoryRepository
                .findByEmployeeIdAndEventTypeIgnoreCaseOrderByEffectiveDateDescCreatedAtDesc(
                        employeeId,
                        normalizedEventType
                );
    }

    // =========================================================
    // GET STATUS HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeLifecycleHistory>
    getStatusHistory(
            Long employeeId,
            String previousStatus,
            String newStatus,
            Authentication authentication) {

        requireViewAccess(authentication);

        requireEmployeeExists(employeeId);

        String normalizedPreviousStatus =
                normalizeRequired(
                        previousStatus,
                        "Previous status is required."
                );

        String normalizedNewStatus =
                normalizeRequired(
                        newStatus,
                        "New status is required."
                );

        return lifecycleHistoryRepository
                .findByEmployeeIdAndPreviousStatusAndNewStatusOrderByEffectiveDateDescCreatedAtDesc(
                        employeeId,
                        normalizedPreviousStatus,
                        normalizedNewStatus
                );
    }

    // =========================================================
    // GET HISTORY BY EFFECTIVE DATE
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeLifecycleHistory>
    getHistoryByEffectiveDate(
            Long employeeId,
            LocalDate effectiveDate,
            Authentication authentication) {

        requireViewAccess(authentication);

        requireEmployeeExists(employeeId);

        if (effectiveDate == null) {
            throw new IllegalArgumentException(
                    "Effective date is required."
            );
        }

        return lifecycleHistoryRepository
                .findByEmployeeIdAndEffectiveDateOrderByCreatedAtDesc(
                        employeeId,
                        effectiveDate
                );
    }

    // =========================================================
    // RESOLVE EMPLOYEE
    // =========================================================

    private EmployeeRecord resolveEmployee(
            Long employeeId) {

        if (employeeId == null) {
            return null;
        }

        return employeeRecordRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee record not found: "
                                        + employeeId
                        )
                );
    }

    // =========================================================
    // RESOLVE ADMIN USER
    // =========================================================

    private AdminUser resolveAdminUser(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new SecurityException(
                    "Authentication is required."
            );
        }

        String username =
                authentication.getName();

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                username.trim()
                        )
                        .orElseThrow(() ->
                                new SecurityException(
                                        "Authenticated admin account not found."
                                )
                        );

        if (adminUser.isDeleted()) {
            throw new SecurityException(
                    "Admin account has been deleted."
            );
        }

        if (!adminUser.isApproved()) {
            throw new SecurityException(
                    "Admin account is not approved."
            );
        }

        if (!adminUser.isEnabled()) {
            throw new SecurityException(
                    "Admin account is disabled."
            );
        }

        return adminUser;
    }

    // =========================================================
    // VIEW ACCESS
    // =========================================================

    private void requireViewAccess(
            Authentication authentication) {

        adminAuthorizationService.requirePermission(
                authentication,
                VIEW_PERMISSION
        );
    }

    // =========================================================
    // EMPLOYEE EXISTS
    // =========================================================

    private void requireEmployeeExists(
            Long employeeId) {

        if (employeeId == null) {
            throw new IllegalArgumentException(
                    "Employee ID is required."
            );
        }

        if (!employeeRecordRepository
                .existsById(employeeId)) {

            throw new IllegalArgumentException(
                    "Employee not found: "
                            + employeeId
            );
        }
    }

    // =========================================================
    // EVENT TYPE
    // =========================================================

    private String normalizeEventType(
            String eventType) {

        if (eventType == null ||
                eventType.trim().isEmpty()) {

            return "EMPLOYEE_UPDATE";
        }

        return eventType
                .trim()
                .toUpperCase();
    }

    // =========================================================
    // REQUIRED STRING
    // =========================================================

    private String normalizeRequired(
            String value,
            String message) {

        if (value == null ||
                value.isBlank()) {

            throw new IllegalArgumentException(
                    message
            );
        }

        return value.trim();
    }

    // =========================================================
    // OPTIONAL VALUE
    // =========================================================

    private String normalizeOptional(
            String value) {

        if (value == null) {
            return null;
        }

        String normalized =
                value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }
}