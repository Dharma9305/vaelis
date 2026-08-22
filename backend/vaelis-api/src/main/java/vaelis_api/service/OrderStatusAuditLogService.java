package vaelis_api.service;

import vaelis_api.entity.OrderStatusAuditLog;
import vaelis_api.repository.OrderStatusAuditLogRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderStatusAuditLogService {

    private final OrderStatusAuditLogRepository repository;

    public OrderStatusAuditLogService(
            OrderStatusAuditLogRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // CREATE STATUS AUDIT LOG
    // =========================================================

    @Transactional
    public OrderStatusAuditLog logStatusChange(
            Long orderId,
            String fromStatus,
            String toStatus) {

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

        OrderStatusAuditLog auditLog =
                new OrderStatusAuditLog();

        auditLog.setOrderId(
                orderId
        );

        auditLog.setFromStatus(
                fromStatus
        );

        auditLog.setToStatus(
                toStatus
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
    // GET ORDER STATUS HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<OrderStatusAuditLog>
    getOrderStatusHistory(
            Long orderId) {

        return repository
                .findByOrderIdOrderByChangedAtDesc(
                        orderId
                );
    }
}