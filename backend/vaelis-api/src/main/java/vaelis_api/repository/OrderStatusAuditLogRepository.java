package vaelis_api.repository;

import vaelis_api.entity.OrderStatusAuditLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusAuditLogRepository
        extends JpaRepository<OrderStatusAuditLog, Long> {

    // =========================================================
    // GET ORDER STATUS HISTORY
    // =========================================================

    List<OrderStatusAuditLog>
    findByOrderIdOrderByChangedAtDesc(
            Long orderId
    );
}