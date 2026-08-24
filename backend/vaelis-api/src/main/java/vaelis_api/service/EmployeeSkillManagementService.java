package vaelis_api.service;

import vaelis_api.dto.EmployeeSkillRequest;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.entity.EmployeeSkill;
import vaelis_api.repository.EmployeeRecordRepository;
import vaelis_api.repository.EmployeeSkillRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;

@Service
public class EmployeeSkillManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_SKILL_VIEW";

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_SKILL_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_SKILL_UPDATE";

    private static final String DELETE_PERMISSION =
            "EMPLOYEE_SKILL_DELETE";

    private final EmployeeSkillRepository
            employeeSkillRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    private final AdminAuthorizationService
            adminAuthorizationService;

    public EmployeeSkillManagementService(
            EmployeeSkillRepository employeeSkillRepository,
            EmployeeRecordRepository employeeRecordRepository,
            AdminActivityLogService adminActivityLogService,
            AdminAuthorizationService adminAuthorizationService) {

        this.employeeSkillRepository =
                employeeSkillRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminActivityLogService =
                adminActivityLogService;

        this.adminAuthorizationService =
                adminAuthorizationService;
    }

    // =========================================================
    // GET ALL SKILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeSkill> getAllSkills(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeSkill> skills =
                employeeSkillRepository
                        .findByEmployeeIdOrderBySkillNameAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_SKILL_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee skills viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + skills.size(),
                "SUCCESS"
        );

        return skills;
    }

    // =========================================================
    // GET ACTIVE SKILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeSkill> getActiveSkills(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeSkill> skills =
                employeeSkillRepository
                        .findByEmployeeIdAndActiveTrueOrderBySkillNameAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_ACTIVE_SKILL_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Active employee skills viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + skills.size(),
                "SUCCESS"
        );

        return skills;
    }

    // =========================================================
    // GET SINGLE SKILL
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeSkill getSkill(
            Long employeeId,
            Long skillId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeSkill skill =
                findSkill(skillId);

        validateSkillBelongsToEmployee(
                skill,
                employee
        );

        adminActivityLogService.log(
                "EMPLOYEE_SKILL_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee skill viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Skill ID: "
                        + skill.getId(),
                "SUCCESS"
        );

        return skill;
    }

    // =========================================================
    // CREATE SKILL
    // =========================================================

    @Transactional
    public EmployeeSkill createSkill(
            Long employeeId,
            EmployeeSkillRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE_PERMISSION,
                CREATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        String skillName =
                normalizeRequired(
                        request.getSkillName()
                );

        // =====================================================
        // PREVENT DUPLICATE SKILL
        // =====================================================

        if (employeeSkillRepository
                .existsByEmployeeIdAndSkillNameIgnoreCase(
                        employeeId,
                        skillName
                )) {

            throw new IllegalStateException(
                    "A skill named "
                            + skillName
                            + " already exists for this employee."
            );
        }

        EmployeeSkill skill =
                new EmployeeSkill();

        skill.setEmployee(employee);

        applyRequest(
                skill,
                request,
                true
        );

        EmployeeSkill saved =
                employeeSkillRepository.save(
                        skill
                );

        adminActivityLogService.log(
                "EMPLOYEE_SKILL_CREATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee skill created. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Skill ID: "
                        + saved.getId()
                        + ". Skill: "
                        + saved.getSkillName(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE SKILL
    // =========================================================

    @Transactional
    public EmployeeSkill updateSkill(
            Long employeeId,
            Long skillId,
            EmployeeSkillRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE_PERMISSION,
                UPDATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeSkill skill =
                findSkill(skillId);

        validateSkillBelongsToEmployee(
                skill,
                employee
        );

        validateRequest(request);

        String skillName =
                normalizeRequired(
                        request.getSkillName()
                );

        // =====================================================
        // PREVENT SKILL NAME COLLISION
        // =====================================================

        List<EmployeeSkill> existingSkills =
                employeeSkillRepository
                        .findByEmployeeIdOrderBySkillNameAsc(
                                employeeId
                        );

        for (EmployeeSkill existing :
                existingSkills) {

            if (!existing.getId().equals(skillId) &&
                    existing.getSkillName() != null &&
                    existing.getSkillName()
                            .equalsIgnoreCase(skillName)) {

                throw new IllegalStateException(
                        "A skill named "
                                + skillName
                                + " already exists for this employee."
                );
            }
        }

        applyRequest(
                skill,
                request,
                skill.isActive()
        );

        EmployeeSkill updated =
                employeeSkillRepository.save(
                        skill
                );

        adminActivityLogService.log(
                "EMPLOYEE_SKILL_UPDATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee skill updated. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Skill ID: "
                        + updated.getId()
                        + ". Skill: "
                        + updated.getSkillName(),
                "SUCCESS"
        );

        return updated;
    }

    // =========================================================
    // DELETE SKILL
    // =========================================================

    @Transactional
    public void deleteSkill(
            Long employeeId,
            Long skillId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE_PERMISSION,
                DELETE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeSkill skill =
                findSkill(skillId);

        validateSkillBelongsToEmployee(
                skill,
                employee
        );

        employeeSkillRepository.delete(
                skill
        );

        adminActivityLogService.log(
                "EMPLOYEE_SKILL_DELETE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee skill deleted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Skill ID: "
                        + skillId
                        + ". Skill: "
                        + skill.getSkillName(),
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
    // FIND SKILL
    // =========================================================

    private EmployeeSkill findSkill(
            Long skillId) {

        if (skillId == null) {

            throw new IllegalArgumentException(
                    "Skill ID is required."
            );
        }

        return employeeSkillRepository
                .findById(skillId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee skill not found."
                        )
                );
    }

    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateSkillBelongsToEmployee(
            EmployeeSkill skill,
            EmployeeRecord employee) {

        if (skill.getEmployee() == null ||
                skill.getEmployee().getId() == null ||
                !skill.getEmployee()
                        .getId()
                        .equals(employee.getId())) {

            throw new IllegalArgumentException(
                    "Employee skill does not belong to the requested employee."
            );
        }
    }

    // =========================================================
    // REQUEST VALIDATION
    // =========================================================

    private void validateRequest(
            EmployeeSkillRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Skill request is required."
            );
        }

        requireText(
                request.getSkillName(),
                "Skill name is required."
        );

        validateSkillLevel(
                request.getSkillLevel()
        );

        validateYearsOfExperience(
                request.getYearsOfExperience()
        );

        validateLastUsedYear(
                request.getLastUsedYear()
        );

        validateVerificationStatus(
                request.getVerificationStatus()
        );
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeSkill skill,
            EmployeeSkillRequest request,
            boolean defaultActive) {

        skill.setSkillName(
                normalizeRequired(
                        request.getSkillName()
                )
        );

        skill.setSkillCategory(
                normalizeNullable(
                        request.getSkillCategory()
                )
        );

        skill.setSkillLevel(
                normalizeNullable(
                        request.getSkillLevel()
                )
        );

        skill.setYearsOfExperience(
                request.getYearsOfExperience()
        );

        skill.setLastUsedYear(
                request.getLastUsedYear()
        );

        skill.setCertificationReference(
                normalizeNullable(
                        request.getCertificationReference()
                )
        );

        if (request.getVerificationStatus() != null &&
                !request.getVerificationStatus()
                        .trim()
                        .isEmpty()) {

            skill.setVerificationStatus(
                    normalizeVerificationStatus(
                            request.getVerificationStatus()
                    )
            );

        } else if (skill.getVerificationStatus() == null ||
                skill.getVerificationStatus()
                        .isBlank()) {

            skill.setVerificationStatus(
                    "PENDING"
            );
        }

        skill.setVerificationReference(
                normalizeNullable(
                        request.getVerificationReference()
                )
        );

        if (request.getActive() != null) {

            skill.setActive(
                    request.getActive()
            );

        } else {

            skill.setActive(
                    defaultActive
            );
        }
    }

    // =========================================================
    // SKILL LEVEL
    // =========================================================

    private void validateSkillLevel(
            String skillLevel) {

        if (skillLevel == null ||
                skillLevel.trim().isEmpty()) {

            return;
        }

        String value =
                skillLevel
                        .trim()
                        .toUpperCase();

        if (!"BEGINNER".equals(value) &&
                !"INTERMEDIATE".equals(value) &&
                !"ADVANCED".equals(value) &&
                !"EXPERT".equals(value)) {

            throw new IllegalArgumentException(
                    "Invalid skill level. "
                            + "Allowed values: "
                            + "BEGINNER, INTERMEDIATE, ADVANCED, EXPERT."
            );
        }
    }

    // =========================================================
    // EXPERIENCE VALIDATION
    // =========================================================

    private void validateYearsOfExperience(
            BigDecimal yearsOfExperience) {

        if (yearsOfExperience == null) {
            return;
        }

        if (yearsOfExperience.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            throw new IllegalArgumentException(
                    "Years of experience cannot be negative."
            );
        }

        if (yearsOfExperience.compareTo(
                new BigDecimal("99.99")
        ) > 0) {

            throw new IllegalArgumentException(
                    "Years of experience cannot exceed 99.99."
            );
        }
    }

    // =========================================================
    // LAST USED YEAR VALIDATION
    // =========================================================

    private void validateLastUsedYear(
            Integer lastUsedYear) {

        if (lastUsedYear == null) {
            return;
        }

        int currentYear =
                Year.now().getValue();

        if (lastUsedYear < 1900 ||
                lastUsedYear > currentYear) {

            throw new IllegalArgumentException(
                    "Invalid last used year."
            );
        }
    }

    // =========================================================
    // VERIFICATION STATUS
    // =========================================================

    private void validateVerificationStatus(
            String verificationStatus) {

        if (verificationStatus == null ||
                verificationStatus.trim().isEmpty()) {

            return;
        }

        String value =
                verificationStatus
                        .trim()
                        .toUpperCase();

        if (!"PENDING".equals(value) &&
                !"VERIFIED".equals(value) &&
                !"REJECTED".equals(value)) {

            throw new IllegalArgumentException(
                    "Invalid verification status. "
                            + "Allowed values: "
                            + "PENDING, VERIFIED, REJECTED."
            );
        }
    }

    private String normalizeVerificationStatus(
            String verificationStatus) {

        return verificationStatus
                .trim()
                .toUpperCase();
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
    // REQUIRED STRING
    // =========================================================

    private String normalizeRequired(
            String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Required value is missing."
            );
        }

        return value.trim();
    }

    // =========================================================
    // NULLABLE STRING
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
            String permission,
            String auditPermission) {

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
                "EMPLOYEE_SKILL_ACCESS_DENIED",
                null,
                null,
                "EMPLOYEE",
                "Employee skill access denied. "
                        + "Required permission: "
                        + auditPermission
                        + ". Actor: "
                        + actorUsername,
                "DENIED"
        );

        throw new AdminPermissionDeniedException(
                "You do not have permission to access employee skills."
        );
    }
}