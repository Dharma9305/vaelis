package vaelis_api.repository;

import vaelis_api.entity.EmployeeAddress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeAddressRepository
        extends JpaRepository<EmployeeAddress, Long> {

    // =========================================================
    // ALL ADDRESSES FOR EMPLOYEE
    // =========================================================

    List<EmployeeAddress>
    findByEmployeeIdOrderByAddressTypeAsc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE ADDRESSES
    // =========================================================

    List<EmployeeAddress>
    findByEmployeeIdAndActiveTrueOrderByAddressTypeAsc(
            Long employeeId
    );

    // =========================================================
    // ADDRESS TYPE
    // =========================================================

    List<EmployeeAddress>
    findByEmployeeIdAndAddressTypeIgnoreCase(
            Long employeeId,
            String addressType
    );

    // =========================================================
    // CHECK ADDRESS
    // =========================================================

    boolean existsByEmployeeIdAndAddressTypeIgnoreCase(
            Long employeeId,
            String addressType
    );
}