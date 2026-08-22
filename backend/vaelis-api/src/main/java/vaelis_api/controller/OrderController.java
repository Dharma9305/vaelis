package vaelis_api.controller;

import java.util.List;

import vaelis_api.config.FirebaseAuthenticationFilter.CustomerPrincipal;
import vaelis_api.entity.Order;
import vaelis_api.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService) {

        this.orderService =
                orderService;
    }

    // =========================================================
    // CREATE ORDER
    // =========================================================
    //
    // Kept public temporarily so the existing checkout flow
    // does not break.
    //
    // We will bind the created order to the authenticated
    // Firebase customer in the next frontend/backend step.
    //
    // =========================================================

    // =========================================================
// CREATE CUSTOMER ORDER
// =========================================================

@PostMapping
public ResponseEntity<?> createOrder(
        @RequestBody Order order,
        Authentication authentication) {

    CustomerPrincipal customer =
            getCustomerPrincipal(authentication);

    if (customer == null) {

        return ResponseEntity
                .status(
                        HttpStatus.UNAUTHORIZED
                )
                .body(
                        "Customer authentication required."
                );
    }

    try {

        // =====================================================
        // TRUST FIREBASE IDENTITY
        // =====================================================
        //
        // Never trust the email supplied by the browser.
        //
        // Google customer:
        // Firebase email becomes the order email.
        //
        // Phone customer:
        // Firebase phone becomes the canonical phone.
        //
        // =====================================================

        String firebaseEmail =
                customer.getEmail();

        String firebasePhone =
                normalizePhone(
                        customer.getPhoneNumber()
                );

        if (firebaseEmail != null &&
                !firebaseEmail.isBlank()) {

            order.setEmail(
                    firebaseEmail.trim()
            );
        }

        /*
         * For phone-authenticated customers,
         * use the verified Firebase phone number.
         *
         * For Google customers Firebase may not contain
         * a phone number, so preserve the checkout phone
         * entered by the customer.
         */

        if (firebasePhone != null) {

            order.setPhone(
                    firebasePhone
            );
        }

        // =====================================================
        // CREATE ORDER
        // =====================================================

        Order savedOrder =
                orderService.createOrder(
                        order
                );

        return ResponseEntity.ok(
                savedOrder
        );

    } catch (IllegalArgumentException e) {

        return ResponseEntity
                .badRequest()
                .body(
                        e.getMessage()
                );

    } catch (IllegalStateException e) {

        return ResponseEntity
                .badRequest()
                .body(
                        e.getMessage()
                );

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(
                        e.getMessage()
                );
    }
}
    // =========================================================
    // GET SINGLE CUSTOMER ORDER
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @PathVariable Long id,
            Authentication authentication) {

        CustomerPrincipal customer =
                getCustomerPrincipal(
                        authentication
                );

        if (customer == null) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "Customer authentication required."
                    );
        }

        return orderService
                .getOrderById(id)
                .map(order -> {

                    if (!ownsOrder(
                            order,
                            customer
                    )) {

                        return ResponseEntity
                                .status(
                                        HttpStatus.FORBIDDEN
                                )
                                .body(
                                        "You are not authorized to access this order."
                                );
                    }

                    return ResponseEntity
                            .ok()
                            .body(order);
                })
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================================================
    // GET CUSTOMER ORDERS
    // =========================================================
    //
    // IMPORTANT:
    //
    // We no longer trust an email supplied by the browser.
    //
    // The authenticated Firebase customer's email/phone is
    // used instead.
    //
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getOrders(
            Authentication authentication) {

        CustomerPrincipal customer =
                getCustomerPrincipal(
                        authentication
                );

        if (customer == null) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "Customer authentication required."
                    );
        }

        String email =
                customer.getEmail();

        String phone =
                normalizePhone(
                        customer.getPhoneNumber()
                );

        /*
         * Google customers normally have an email.
         */

        if (email != null &&
                !email.isBlank()) {

            List<Order> orders =
                    orderService
                            .getOrdersByEmail(
                                    email
                            );

            return ResponseEntity.ok(
                    orders
            );
        }

        /*
         * Phone-only Firebase customers may not have
         * an email.
         *
         * We currently need to find orders by phone.
         *
         * This requires the repository method added below.
         */

        if (phone != null &&
                !phone.isBlank()) {

            List<Order> orders =
                    orderService
                            .getOrdersByPhone(
                                    phone
                            );

            return ResponseEntity.ok(
                    orders
            );
        }

        return ResponseEntity
                .badRequest()
                .body(
                        "Authenticated customer does not have a usable email or phone number."
                );
    }

    // =========================================================
    // CUSTOMER CANCEL ORDER
    // =========================================================

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication) {

        CustomerPrincipal customer =
                getCustomerPrincipal(
                        authentication
                );

        if (customer == null) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "Customer authentication required."
                    );
        }

        try {

            Order order =
                    orderService
                            .getOrderById(
                                    orderId
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found."
                                    )
                            );

            /*
             * SECURITY CHECK
             *
             * A customer can cancel only their own order.
             */

            if (!ownsOrder(
                    order,
                    customer
            )) {

                return ResponseEntity
                        .status(
                                HttpStatus.FORBIDDEN
                        )
                        .body(
                                "You are not authorized to cancel this order."
                        );
            }

            Order cancelledOrder =
                    orderService.updateOrderStatus(
                            orderId,
                            "CANCELLED"
                    );

            return ResponseEntity.ok(
                    cancelledOrder
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // =========================================================
    // CUSTOMER PRINCIPAL
    // =========================================================

    private CustomerPrincipal getCustomerPrincipal(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return null;
        }

        Object principal =
                authentication.getPrincipal();

        if (!(principal instanceof CustomerPrincipal)) {

            return null;
        }

        return (CustomerPrincipal) principal;
    }

    // =========================================================
    // ORDER OWNERSHIP
    // =========================================================

    private boolean ownsOrder(
            Order order,
            CustomerPrincipal customer) {

        if (order == null ||
                customer == null) {

            return false;
        }

        // =====================================================
        // EMAIL OWNERSHIP
        // =====================================================

        String customerEmail =
                customer.getEmail();

        String orderEmail =
                order.getEmail();

        if (customerEmail != null &&
                !customerEmail.isBlank() &&
                orderEmail != null &&
                !orderEmail.isBlank()) {

            if (customerEmail
                    .trim()
                    .equalsIgnoreCase(
                            orderEmail.trim()
                    )) {

                return true;
            }
        }

        // =====================================================
        // PHONE OWNERSHIP
        // =====================================================

        String customerPhone =
                normalizePhone(
                        customer.getPhoneNumber()
                );

        String orderPhone =
                normalizePhone(
                        order.getPhone()
                );

        if (customerPhone != null &&
                orderPhone != null &&
                customerPhone.equals(
                        orderPhone
                )) {

            return true;
        }

        return false;
    }

    // =========================================================
    // PHONE NORMALIZATION
    // =========================================================
    //
    // Firebase phone:
    //
    // +919876543210
    //
    // Existing VAELIS order:
    //
    // 9876543210
    //
    // Both become:
    //
    // 9876543210
    //
    // =========================================================

    private String normalizePhone(
            String phone) {

        if (phone == null ||
                phone.isBlank()) {

            return null;
        }

        String digits =
                phone.replaceAll(
                        "\\D",
                        ""
                );

        if (digits.length() > 10) {

            return digits.substring(
                    digits.length() - 10
            );
        }

        if (digits.length() == 10) {

            return digits;
        }

        return null;
    }
}