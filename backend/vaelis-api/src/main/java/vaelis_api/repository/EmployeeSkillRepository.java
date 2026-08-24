package vaelis_api.repository;

import vaelis_api.entity.EmployeeSkill;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeSkillRepository
        extends JpaRepository<EmployeeSkill, Long> {

    // =========================================================
    // ALL SKILLS
    // =========================================================

    List<EmployeeSkill>
    findByEmployeeIdOrderBySkillNameAsc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE SKILLS
    // =========================================================

    List<EmployeeSkill>
    findByEmployeeIdAndActiveTrueOrderBySkillNameAsc(
            Long employeeId
    );

    // =========================================================
    // SKILL CATEGORY
    // =========================================================

    List<EmployeeSkill>
    findByEmployeeIdAndSkillCategoryIgnoreCase(
            Long employeeId,
            String skillCategory
    );

    // =========================================================
    // SKILL LEVEL
    // =========================================================

    List<EmployeeSkill>
    findByEmployeeIdAndSkillLevelIgnoreCase(
            Long employeeId,
            String skillLevel
    );

    // =========================================================
    // VERIFICATION
    // =========================================================

    List<EmployeeSkill>
    findByEmployeeIdAndVerificationStatusIgnoreCase(
            Long employeeId,
            String verificationStatus
    );

    // =========================================================
    // DUPLICATE SKILL CHECK
    // =========================================================

    boolean existsByEmployeeIdAndSkillNameIgnoreCase(
            Long employeeId,
            String skillName
    );
}