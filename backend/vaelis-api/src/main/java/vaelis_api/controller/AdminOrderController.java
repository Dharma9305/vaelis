package vaelis_api.controller;
import vaelis_api.entity.OrderStatusAuditLog;
import vaelis_api.service.OrderStatusAuditLogService;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vaelis_api.entity.OrderShipmentAuditLog;
import vaelis_api.service.OrderShipmentAuditLogService;
import vaelis_api.entity.Order;
import vaelis_api.repository.OrderRepository;
import vaelis_api.service.EmailService;
import vaelis_api.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final EmailService emailService;
    private final OrderStatusAuditLogService orderStatusAuditLogService;
    private final OrderShipmentAuditLogService orderShipmentAuditLogService;

    public AdminOrderController(
        OrderRepository orderRepository,
        OrderService orderService,
        EmailService emailService,
        OrderShipmentAuditLogService
        orderShipmentAuditLogService,
        OrderStatusAuditLogService orderStatusAuditLogService) {

    this.orderRepository = orderRepository;
    this.orderService = orderService;
    this.emailService = emailService;
    this.orderStatusAuditLogService =
            orderStatusAuditLogService;
            this.orderShipmentAuditLogService =
        orderShipmentAuditLogService;
}
        // =========================================================
// GET ORDER SHIPMENT HISTORY
// =========================================================

@GetMapping("/{orderId}/shipment-history")
public ResponseEntity<?> getShipmentHistory(
        @PathVariable Long orderId) {

    try {

        if (!orderRepository.existsById(
                orderId
        )) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        List<OrderShipmentAuditLog> history =
                orderShipmentAuditLogService
                        .getShipmentHistory(
                                orderId
                        );

        return ResponseEntity.ok(
                history
        );

    } catch (RuntimeException e) {

        System.err.println(
                "Unable to load shipment history: "
                        + e.getMessage()
        );

        return ResponseEntity
                .internalServerError()
                .body(
                        "Unable to load shipment history."
                );
    }
}

    // =========================================================
    // GET ALL ORDERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderRepository
                        .findAllByOrderByCreatedAtDesc()
        );
    }

    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {

        try {

            String status =
                    request.get("status");

            if (status == null ||
                    status.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Status is required");
            }

            Order updatedOrder =
                    orderService.updateOrderStatus(
                            orderId,
                            status.trim().toUpperCase()
                    );

            // -------------------------------------------------
            // SEND STATUS EMAIL
            // -------------------------------------------------

            try {

                emailService.sendOrderStatusEmail(
                        updatedOrder
                );

            } catch (Exception emailError) {

                System.err.println(
                        "Order updated but status email failed: "
                                + emailError.getMessage()
                );
            }

            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (RuntimeException e) {

            System.err.println(
                    "Order status update failed: "
                            + e.getMessage()
            );

            return ResponseEntity.notFound()
                    .build();
        }
    }

    // =========================================================
    // RECORD PAYMENT RECEIVED
    // =========================================================
    //
    // Supported:
    //
    // COD    = Cash received
    // UPI    = UPI received
    // ONLINE = Online/bank transfer received
    //
    // Example:
    //
    // PUT /api/admin/orders/25/payment
    //
    // {
    //     "paymentMethod": "UPI"
    // }
    //
    // =========================================================

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<?> recordPaymentReceived(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {

        try {

            String paymentMethod =
                    request.get("paymentMethod");

            if (paymentMethod == null ||
                    paymentMethod.isBlank()) {

                return ResponseEntity.badRequest()
                        .body(
                                "Payment method is required"
                        );
            }

            Order updatedOrder =
                    orderService.recordPaymentReceived(
                            orderId,
                            paymentMethod
                    );

            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (RuntimeException e) {

            System.err.println(
                    "Payment recording failed: "
                            + e.getMessage()
            );

            return ResponseEntity.notFound()
                    .build();
        }
    }

    // =========================================================
    // UPDATE SHIPMENT
    // =========================================================

    @PutMapping("/{orderId}/shipment")
    public ResponseEntity<?> updateShipment(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {

        try {

            String shippingPartner =
                    request.get("shippingPartner");

            String trackingNumber =
                    request.get("trackingNumber");

            String trackingUrl =
                    request.get("trackingUrl");

            String expectedDeliveryDate =
                    request.get("expectedDeliveryDate");

            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (shippingPartner == null ||
                    shippingPartner.isBlank()) {

                return ResponseEntity.badRequest()
                        .body(
                                "Shipping partner is required"
                        );
            }

            if (trackingNumber == null ||
                    trackingNumber.isBlank()) {

                return ResponseEntity.badRequest()
                        .body(
                                "Tracking number is required"
                        );
            }

            // -------------------------------------------------
            // SAVE SHIPMENT
            // -------------------------------------------------

            Order updatedOrder =
                    orderService.updateShipment(
                            orderId,
                            shippingPartner,
                            trackingNumber,
                            trackingUrl,
                            expectedDeliveryDate
                    );

            // -------------------------------------------------
            // SEND SHIPMENT EMAIL
            // -------------------------------------------------

            try {

                emailService.sendShipmentEmail(
                        updatedOrder
                );

            } catch (Exception emailError) {

                System.err.println(
                        "Shipment updated but email failed: "
                                + emailError.getMessage()
                );
            }

            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (RuntimeException e) {

            System.err.println(
                    "Shipment update failed: "
                            + e.getMessage()
            );

            return ResponseEntity.notFound()
                    .build();
        }
    }

    // =========================================================
    // PROCESS REFUND
    // =========================================================

    @PostMapping("/{orderId}/refund")
    public ResponseEntity<?> processRefund(
            @PathVariable Long orderId) {

        try {

            Order refundedOrder =
                    orderService.processRefund(
                            orderId
                    );

            return ResponseEntity.ok(
                    refundedOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (RuntimeException e) {

            System.err.println(
                    "Refund processing failed: "
                            + e.getMessage()
            );

            return ResponseEntity
                    .internalServerError()
                    .body(
                            e.getMessage()
                    );
        }
    }
    // =========================================================
// GET ORDER STATUS HISTORY
// =========================================================

@GetMapping("/{orderId}/status-history")
public ResponseEntity<?> getOrderStatusHistory(
        @PathVariable Long orderId) {

    try {

        // Make sure the order exists
        if (!orderRepository.existsById(orderId)) {

            return ResponseEntity.notFound()
                    .build();
        }

        List<OrderStatusAuditLog> history =
                orderStatusAuditLogService
                        .getOrderStatusHistory(
                                orderId
                        );

        return ResponseEntity.ok(
                history
        );

    } catch (RuntimeException e) {

        System.err.println(
                "Unable to load order status history: "
                        + e.getMessage()
        );

        return ResponseEntity
                .internalServerError()
                .body(
                        "Unable to load order status history."
                );
    }
}
}
