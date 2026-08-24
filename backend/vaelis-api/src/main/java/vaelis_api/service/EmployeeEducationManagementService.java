package vaelis_api.service;

import vaelis_api.dto.EmployeeEducationRequest;
import vaelis_api.entity.EmployeeEducation;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeEducationRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
public class EmployeeEducationManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_EDUCATION_VIEW";

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_EDUCATION_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_EDUCATION_UPDATE";

    private static final String DELETE_PERMISSION =
            "EMPLOYEE_EDUCATION_DELETE";

    private final EmployeeEducationRepository
            employeeEducationRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    private final AdminAuthorizationService
            adminAuthorizationService;

    public EmployeeEducationManagementService(
            EmployeeEducationRepository employeeEducationRepository,
            EmployeeRecordRepository employeeRecordRepository,
            AdminActivityLogService adminActivityLogService,
            AdminAuthorizationService adminAuthorizationService) {

        this.employeeEducationRepository =
                employeeEducationRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminActivityLogService =
                adminActivityLogService;

        this.adminAuthorizationService =
                adminAuthorizationService;
    }

    // =========================================================
    // GET ALL EDUCATION
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEducation> getAllEducation(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEducation> records =
                employeeEducationRepository
                        .findByEmployeeIdOrderByCompletionYearDesc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee education records viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + records.size(),
                "SUCCESS"
        );

        return records;
    }

    // =========================================================
    // GET ACTIVE EDUCATION
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEducation> getActiveEducation(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEducation> records =
                employeeEducationRepository
                        .findByEmployeeIdAndActiveTrueOrderByCompletionYearDesc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_ACTIVE_EDUCATION_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Active employee education records viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + records.size(),
                "SUCCESS"
        );

        return records;
    }

    // =========================================================
    // GET SINGLE
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeEducation getEducation(
            Long employeeId,
            Long educationId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEducation education =
                findEducation(educationId);

        validateBelongsToEmployee(
                education,
                employee
        );

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee education record viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Education ID: "
                        + education.getId(),
                "SUCCESS"
        );

        return education;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public EmployeeEducation createEducation(
            Long employeeId,
            EmployeeEducationRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        EmployeeEducation education =
                new EmployeeEducation();

        education.setEmployee(employee);

        applyRequest(
                education,
                request,
                true
        );

        EmployeeEducation saved =
                employeeEducationRepository.save(
                        education
                );

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_CREATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee education created. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Education ID: "
                        + saved.getId()
                        + ". Qualification: "
                        + saved.getQualification(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public EmployeeEducation updateEducation(
            Long employeeId,
            Long educationId,
            EmployeeEducationRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEducation education =
                findEducation(educationId);

        validateBelongsToEmployee(
                education,
                employee
        );

        validateRequest(request);

        applyRequest(
                education,
                request,
                education.isActive()
        );

        EmployeeEducation updated =
                employeeEducationRepository.save(
                        education
                );

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_UPDATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee education updated. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Education ID: "
                        + updated.getId(),
                "SUCCESS"
        );

        return updated;
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void deleteEducation(
            Long employeeId,
            Long educationId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEducation education =
                findEducation(educationId);

        validateBelongsToEmployee(
                education,
                employee
        );

        employeeEducationRepository.delete(
                education
        );

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_DELETE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee education deleted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Education ID: "
                        + educationId
                        + ". Qualification: "
                        + education.getQualification(),
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
    // FIND EDUCATION
    // =========================================================

    private EmployeeEducation findEducation(
            Long educationId) {

        if (educationId == null) {

            throw new IllegalArgumentException(
                    "Education ID is required."
            );
        }

        return employeeEducationRepository
                .findById(educationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee education record not found."
                        )
                );
    }

    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateBelongsToEmployee(
            EmployeeEducation education,
            EmployeeRecord employee) {

        if (education.getEmployee() == null ||
                education.getEmployee().getId() == null ||
                !education.getEmployee()
                        .getId()
                        .equals(employee.getId())) {

            throw new IllegalArgumentException(
                    "Employee education record does not belong "
                            + "to the requested employee."
            );
        }
    }

    // =========================================================
    // REQUEST VALIDATION
    // =========================================================

    private void validateRequest(
            EmployeeEducationRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Education request is required."
            );
        }

        requireText(
                request.getEducationLevel(),
                "Education level is required."
        );

        requireText(
                request.getQualification(),
                "Qualification is required."
        );

        requireText(
                request.getInstitution(),
                "Institution is required."
        );

        validateYear(
                request.getStartYear(),
                "Start year"
        );

        validateYear(
                request.getCompletionYear(),
                "Completion year"
        );

        if (request.getStartYear() != null &&
                request.getCompletionYear() != null &&
                request.getStartYear() >
                        request.getCompletionYear()) {

            throw new IllegalArgumentException(
                    "Start year cannot be greater than completion year."
            );
        }
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeEducation education,
            EmployeeEducationRequest request,
            boolean defaultActive) {

        education.setEducationLevel(
                request.getEducationLevel().trim()
        );

        education.setQualification(
                request.getQualification().trim()
        );

        education.setSpecialization(
                normalizeNullable(
                        request.getSpecialization()
                )
        );

        education.setInstitution(
                request.getInstitution().trim()
        );

        education.setUniversityOrBoard(
                normalizeNullable(
                        request.getUniversityOrBoard()
                )
        );

        education.setStartYear(
                request.getStartYear()
        );

        education.setCompletionYear(
                request.getCompletionYear()
        );

        education.setGradingType(
                normalizeNullable(
                        request.getGradingType()
                )
        );

        education.setGradeOrPercentage(
                normalizeNullable(
                        request.getGradeOrPercentage()
                )
        );

        education.setRegistrationNumber(
                normalizeNullable(
                        request.getRegistrationNumber()
                )
        );

        String verificationStatus =
                normalizeNullable(
                        request.getVerificationStatus()
                );

        education.setVerificationStatus(
                verificationStatus != null
                        ? verificationStatus
                                .toUpperCase()
                        : "PENDING"
        );

        education.setCertificateReference(
                normalizeNullable(
                        request.getCertificateReference()
                )
        );

        if (request.getActive() != null) {

            education.setActive(
                    request.getActive()
            );

        } else {

            education.setActive(
                    defaultActive
            );
        }
    }

    // =========================================================
    // YEAR VALIDATION
    // =========================================================

    private void validateYear(
            Integer year,
            String fieldName) {

        if (year == null) {
            return;
        }

        int currentYear =
                Year.now().getValue();

        if (year < 1900 ||
                year > currentYear + 10) {

            throw new IllegalArgumentException(
                    fieldName
                            + " must be between 1900 and "
                            + (currentYear + 10)
                            + "."
            );
        }
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

    private String getEmployeeUsername(
            EmployeeRecord employee) {

        if (employee.getAdminUser() == null) {
            return null;
        }

        return employee
                .getAdminUser()
                .getUsername();
    }

    // =========================================================
    // PERMISSION CHECK
    // =========================================================

    private void requirePermission(
            Authentication authentication,
            String permission) {

        if (adminAuthorizationService.hasPermission(
                authentication,
                permission
        )) {

            return;
        }

        String actorUsername =
                authentication != null
                        ? authentication.getName()
                        : "UNKNOWN";

        adminActivityLogService.log(
                "EMPLOYEE_EDUCATION_ACCESS_DENIED",
                null,
                null,
                "EMPLOYEE",
                "Employee education access denied. "
                        + "Required permission: "
                        + permission
                        + ". Actor: "
                        + actorUsername,
                "DENIED"
        );

        throw new AdminPermissionDeniedException(
                "You do not have permission to access employee education."
        );
    }
}