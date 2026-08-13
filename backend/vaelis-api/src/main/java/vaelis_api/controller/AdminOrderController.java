package vaelis_api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    public AdminOrderController(
            OrderRepository orderRepository,
            OrderService orderService,
            EmailService emailService) {

        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.emailService = emailService;
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
                            status
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

        } catch (RuntimeException e) {

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

                /*
                 * Shipment has already been saved.
                 *
                 * Email failure should not undo
                 * the shipment update.
                 */

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

        } catch (RuntimeException e) {

            return ResponseEntity.notFound()
                    .build();
        }
    }
}