package vaelis_api.repository;

import vaelis_api.entity.OrderShipmentAuditLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderShipmentAuditLogRepository
        extends JpaRepository<OrderShipmentAuditLog, Long> {

    List<OrderShipmentAuditLog>
    findByOrderIdOrderByChangedAtDesc(
            Long orderId
    );
}