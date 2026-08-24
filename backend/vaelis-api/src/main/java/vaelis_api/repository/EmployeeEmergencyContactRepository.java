package vaelis_api.repository;

import vaelis_api.entity.EmployeeEmergencyContact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeEmergencyContactRepository
        extends JpaRepository<
                EmployeeEmergencyContact,
                Long> {

    // =========================================================
    // ALL CONTACTS FOR EMPLOYEE
    // =========================================================

    List<EmployeeEmergencyContact>
    findByEmployeeIdOrderByPrimaryDescContactNameAsc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE CONTACTS
    // =========================================================

    List<EmployeeEmergencyContact>
    findByEmployeeIdAndActiveTrueOrderByPrimaryDescContactNameAsc(
            Long employeeId
    );

    // =========================================================
    // PRIMARY CONTACT
    // =========================================================

    List<EmployeeEmergencyContact>
    findByEmployeeIdAndPrimaryTrue(
            Long employeeId
    );

    // =========================================================
    // CHECK CONTACT
    // =========================================================

    boolean existsByEmployeeIdAndPrimaryMobile(
            Long employeeId,
            String primaryMobile
    );
}