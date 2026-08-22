package vaelis_api.service;

import vaelis_api.entity.OrderShipmentAuditLog;
import vaelis_api.repository.OrderShipmentAuditLogRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderShipmentAuditLogService {

    private final OrderShipmentAuditLogRepository repository;

    public OrderShipmentAuditLogService(
            OrderShipmentAuditLogRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // LOG SHIPMENT UPDATE
    // =========================================================

    @Transactional
    public OrderShipmentAuditLog logShipmentUpdate(
            Long orderId,
            String shippingPartner,
            String trackingNumber,
            String trackingUrl,
            LocalDate expectedDeliveryDate) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String changedBy = "SYSTEM";
        String changedByRole = "SYSTEM";

        if (authentication != null &&
                authentication.isAuthenticated()) {

            changedBy =
                    authentication.getName();

            changedByRole =
                    authentication
                            .getAuthorities()
                            .stream()
                            .findFirst()
                            .map(authority ->
                                    authority
                                            .getAuthority())
                            .orElse("UNKNOWN");

            if (changedByRole.startsWith(
                    "ROLE_"
            )) {

                changedByRole =
                        changedByRole.substring(
                                "ROLE_".length()
                        );
            }
        }

        OrderShipmentAuditLog auditLog =
                new OrderShipmentAuditLog();

        auditLog.setOrderId(
                orderId
        );

        auditLog.setShippingPartner(
                shippingPartner
        );

        auditLog.setTrackingNumber(
                trackingNumber
        );

        auditLog.setTrackingUrl(
                trackingUrl
        );

        auditLog.setExpectedDeliveryDate(
                expectedDeliveryDate
        );

        auditLog.setChangedBy(
                changedBy
        );

        auditLog.setChangedByRole(
                changedByRole
        );

        auditLog.setChangedAt(
                LocalDateTime.now()
        );

        return repository.save(
                auditLog
        );
    }

    // =========================================================
    // GET SHIPMENT HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<OrderShipmentAuditLog>
    getShipmentHistory(
            Long orderId) {

        return repository
                .findByOrderIdOrderByChangedAtDesc(
                        orderId
                );
    }
}