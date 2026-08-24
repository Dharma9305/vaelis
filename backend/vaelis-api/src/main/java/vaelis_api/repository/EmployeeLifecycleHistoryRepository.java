package vaelis_api.repository;

import vaelis_api.entity.EmployeeLifecycleHistory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeLifecycleHistoryRepository
        extends JpaRepository<EmployeeLifecycleHistory, Long> {

    // =========================================================
    // ALL LIFECYCLE HISTORY FOR EMPLOYEE
    // =========================================================

    List<EmployeeLifecycleHistory>
    findByEmployeeIdOrderByEffectiveDateDescCreatedAtDesc(
            Long employeeId
    );

    // =========================================================
    // EVENT TYPE
    // =========================================================

    List<EmployeeLifecycleHistory>
    findByEmployeeIdAndEventTypeIgnoreCaseOrderByEffectiveDateDescCreatedAtDesc(
            Long employeeId,
            String eventType
    );

    // =========================================================
    // STATUS HISTORY
    // =========================================================

    List<EmployeeLifecycleHistory>
    findByEmployeeIdAndPreviousStatusAndNewStatusOrderByEffectiveDateDescCreatedAtDesc(
            Long employeeId,
            String previousStatus,
            String newStatus
    );

    // =========================================================
    // EFFECTIVE DATE
    // =========================================================

    List<EmployeeLifecycleHistory>
    findByEmployeeIdAndEffectiveDateOrderByCreatedAtDesc(
            Long employeeId,
            java.time.LocalDate effectiveDate
    );
}