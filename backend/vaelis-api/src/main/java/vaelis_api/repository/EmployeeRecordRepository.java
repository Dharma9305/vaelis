package vaelis_api.repository;

import vaelis_api.entity.EmployeeRecord;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRecordRepository
        extends JpaRepository<EmployeeRecord, Long> {

    // =========================================================
    // FIND BY EMPLOYEE CODE
    // =========================================================

    Optional<EmployeeRecord>
    findByEmployeeCodeIgnoreCase(
            String employeeCode
    );

    // =========================================================
    // FIND BY LINKED ADMIN USER
    // =========================================================

    Optional<EmployeeRecord>
    findByAdminUserId(
            Long adminUserId
    );

    // =========================================================
    // CHECK EXISTING EMPLOYEE RECORD
    // =========================================================

    boolean existsByAdminUserId(
            Long adminUserId
    );

    // =========================================================
    // CHECK EMPLOYEE CODE
    // =========================================================

    boolean existsByEmployeeCodeIgnoreCase(
            String employeeCode
    );

    // =========================================================
    // LIST EMPLOYEES
    // =========================================================

    List<EmployeeRecord>
    findAllByOrderByCreatedAtDesc();

    // =========================================================
    // DEPARTMENT
    // =========================================================

    List<EmployeeRecord>
    findByDepartmentIgnoreCaseOrderByCreatedAtDesc(
            String department
    );

    // =========================================================
    // EMPLOYMENT STATUS
    // =========================================================

    List<EmployeeRecord>
    findByEmploymentStatusIgnoreCaseOrderByCreatedAtDesc(
            String employmentStatus
    );
}