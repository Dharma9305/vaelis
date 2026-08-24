package vaelis_api.repository;

import vaelis_api.entity.EmployeeEmploymentHistory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeEmploymentHistoryRepository
        extends JpaRepository<
                EmployeeEmploymentHistory,
                Long> {

    // =========================================================
    // ALL EMPLOYMENT HISTORY
    // =========================================================

    List<EmployeeEmploymentHistory>
    findByEmployeeIdOrderByStartDateDesc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE RECORDS
    // =========================================================

    List<EmployeeEmploymentHistory>
    findByEmployeeIdAndActiveTrueOrderByStartDateDesc(
            Long employeeId
    );

    // =========================================================
    // VERIFICATION
    // =========================================================

    List<EmployeeEmploymentHistory>
    findByEmployeeIdAndVerificationStatusIgnoreCase(
            Long employeeId,
            String verificationStatus
    );

    // =========================================================
    // COMPANY
    // =========================================================

    List<EmployeeEmploymentHistory>
    findByEmployeeIdAndCompanyNameIgnoreCase(
            Long employeeId,
            String companyName
    );
}