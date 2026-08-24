package vaelis_api.repository;

import vaelis_api.entity.EmployeeEducation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeEducationRepository
        extends JpaRepository<EmployeeEducation, Long> {

    // =========================================================
    // ALL EDUCATION RECORDS
    // =========================================================

    List<EmployeeEducation>
    findByEmployeeIdOrderByCompletionYearDesc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE EDUCATION RECORDS
    // =========================================================

    List<EmployeeEducation>
    findByEmployeeIdAndActiveTrueOrderByCompletionYearDesc(
            Long employeeId
    );

    // =========================================================
    // EDUCATION LEVEL
    // =========================================================

    List<EmployeeEducation>
    findByEmployeeIdAndEducationLevelIgnoreCase(
            Long employeeId,
            String educationLevel
    );

    // =========================================================
    // VERIFICATION STATUS
    // =========================================================

    List<EmployeeEducation>
    findByEmployeeIdAndVerificationStatusIgnoreCase(
            Long employeeId,
            String verificationStatus
    );
}