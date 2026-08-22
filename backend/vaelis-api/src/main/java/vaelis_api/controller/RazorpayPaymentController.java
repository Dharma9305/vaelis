package vaelis_api.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import vaelis_api.config.FirebaseAuthenticationFilter.CustomerPrincipal;
import vaelis_api.service.OrderService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class RazorpayPaymentController {

    private final RazorpayClient razorpayClient;
    private final OrderService orderService;

    public RazorpayPaymentController(
            RazorpayClient razorpayClient,
            OrderService orderService) {

        this.razorpayClient = razorpayClient;
        this.orderService = orderService;
    }

    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

   @PostMapping("/create/{orderId}")
public ResponseEntity<?> createPaymentOrder(
        @PathVariable Long orderId,
        Authentication authentication)
        {
                CustomerPrincipal customer =
        getCustomerPrincipal(authentication);

if (customer == null) {

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(
                    "Customer authentication required."
            );
}

        try {

            // =================================================
            // LOAD VAELIS ORDER
            // =================================================

            vaelis_api.entity.Order vaelisOrder =
                    orderService
                            .getOrderById(orderId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"
                                    )
                            );

                        if (!ownsOrder(
        vaelisOrder,
        customer
)) {

    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(
                    "You are not authorized to make payment for this order."
            );
}

            // =================================================
            // PAYMENT STATUS VALIDATION
            // =================================================

            String paymentStatus =
                    vaelisOrder.getPaymentStatus();

            if (!"PENDING".equalsIgnoreCase(
                    paymentStatus
            )) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "This order is not available for payment. "
                                        + "Current payment status: "
                                        + paymentStatus
                        );
            }

            // =================================================
            // ORDER STATUS VALIDATION
            // =================================================

            String orderStatus =
                    vaelisOrder.getOrderStatus();

            if (!"PLACED".equalsIgnoreCase(
                    orderStatus
            )) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "This order is not available for payment. "
                                        + "Current order status: "
                                        + orderStatus
                        );
            }

            // =================================================
            // AMOUNT VALIDATION
            // =================================================

            if (vaelisOrder.getTotal() == null ||
                    vaelisOrder.getTotal() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid order amount"
                        );
            }

            // =================================================
            // AMOUNT IN PAISE
            // =================================================

            long amountInPaise =
                    Math.round(
                            vaelisOrder.getTotal() * 100
                    );

            String vaelisOrderId =
                    vaelisOrder
                            .getId()
                            .toString();

            String customerEmail =
                    vaelisOrder.getEmail() == null
                            ? ""
                            : vaelisOrder.getEmail();

            // =================================================
            // RAZORPAY ORDER REQUEST
            // =================================================

            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    Long.valueOf(amountInPaise)
            );

            orderRequest.put(
                    "currency",
                    "INR"
            );

            orderRequest.put(
                    "receipt",
                    "VAELIS-" + vaelisOrderId
            );

            // =================================================
            // RAZORPAY NOTES
            // =================================================

            JSONObject notes =
                    new JSONObject();

            notes.put(
                    "vaelis_order_id",
                    vaelisOrderId
            );

            notes.put(
                    "customer_email",
                    customerEmail
            );

            orderRequest.put(
                    "notes",
                    notes
            );

            // =================================================
            // CREATE RAZORPAY ORDER
            // =================================================

            Order razorpayOrder =
                    razorpayClient.orders.create(
                            orderRequest
                    );

            String razorpayOrderId =
                    razorpayOrder
                            .get("id")
                            .toString();

            // =================================================
            // RESPONSE
            // =================================================

            JSONObject response =
                    new JSONObject();

            response.put(
                    "razorpayOrderId",
                    razorpayOrderId
            );

            response.put(
                    "amount",
                    Long.valueOf(amountInPaise)
            );

            response.put(
                    "currency",
                    "INR"
            );

            response.put(
                    "vaelisOrderId",
                    vaelisOrderId
            );

            return ResponseEntity.ok(
                    response.toMap()
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to create Razorpay order: "
                                    + e.getMessage()
                    );
        }
    }

    // =========================================================
    // VERIFY RAZORPAY PAYMENT
    // =========================================================

    @PostMapping("/verify")
public ResponseEntity<?> verifyPayment(
        @RequestBody java.util.Map<String, Object> paymentData,
        Authentication authentication) {

                CustomerPrincipal customer =
        getCustomerPrincipal(authentication);

if (customer == null) {

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(
                    "Customer authentication required."
            );
}

        try {

            // =================================================
            // VAELIS ORDER ID
            // =================================================

            String vaelisOrderIdText =
                    String.valueOf(
                            paymentData.get(
                                    "vaelisOrderId"
                            )
                    );

            if ("null".equalsIgnoreCase(
                    vaelisOrderIdText
            ) ||
                    vaelisOrderIdText.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "VAELIS order ID is required"
                        );
            }

            Long vaelisOrderId =
                    Long.valueOf(
                            vaelisOrderIdText
                    );
                    // =================================================
// VERIFY ORDER OWNERSHIP
// =================================================

vaelis_api.entity.Order vaelisOrder =
        orderService
                .getOrderById(vaelisOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

if (!ownsOrder(
        vaelisOrder,
        customer
)) {

    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(
                    "You are not authorized to make payment for this order."
            );
}

            // =================================================
            // RAZORPAY DETAILS
            // =================================================

            String razorpayOrderId =
                    String.valueOf(
                            paymentData.get(
                                    "razorpayOrderId"
                            )
                    );

            String razorpayPaymentId =
                    String.valueOf(
                            paymentData.get(
                                    "razorpayPaymentId"
                            )
                    );

            String razorpaySignature =
                    String.valueOf(
                            paymentData.get(
                                    "razorpaySignature"
                            )
                    );

            // =================================================
            // VALIDATE PAYMENT DETAILS
            // =================================================

            if (razorpayOrderId.equals("null") ||
                    razorpayPaymentId.equals("null") ||
                    razorpaySignature.equals("null") ||
                    razorpayOrderId.isBlank() ||
                    razorpayPaymentId.isBlank() ||
                    razorpaySignature.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Missing Razorpay payment details"
                        );
            }

            // =================================================
            // SIGNATURE PAYLOAD
            // =================================================

            String payload =
                    razorpayOrderId
                            + "|"
                            + razorpayPaymentId;

            // =================================================
            // RAZORPAY SECRET
            // =================================================

            String secret =
                    System.getenv(
                            "RAZORPAY_KEY_SECRET"
                    );

            if (secret == null ||
                    secret.isBlank()) {

                return ResponseEntity
                        .internalServerError()
                        .body(
                                "Razorpay secret is not configured"
                        );
            }

            // =================================================
            // GENERATE SIGNATURE
            // =================================================

            String generatedSignature =
                    hmacSha256(
                            payload,
                            secret
                    );

            // =================================================
            // VERIFY SIGNATURE
            // =================================================

            if (!generatedSignature.equals(
                    razorpaySignature
            )) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Payment signature verification failed"
                        );
            }

            // =================================================
            // MARK PAYMENT AS PAID
            // =================================================
            //
            // OrderService handles:
            //
            // Order lock
            // Product locks
            // Stock validation
            // Stock deduction
            // Payment confirmation
            //
            // =================================================

            vaelis_api.entity.Order paidOrder =
                    orderService.markPaymentAsPaid(
                            vaelisOrderId,
                            razorpayOrderId,
                            razorpayPaymentId
                    );

            // =================================================
            // RESPONSE
            // =================================================

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "success",
                            true,
                            "vaelisOrderId",
                            paidOrder.getId(),
                            "paymentStatus",
                            paidOrder.getPaymentStatus(),
                            "orderStatus",
                            paidOrder.getOrderStatus()
                    )
            );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid VAELIS order ID"
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

            e.printStackTrace();

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to verify payment: "
                                    + e.getMessage()
                    );
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
        vaelis_api.entity.Order order,
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

    // =========================================================
    // HMAC SHA256
    // =========================================================

    private String hmacSha256(
            String data,
            String secret) throws Exception {

        javax.crypto.Mac mac =
                javax.crypto.Mac.getInstance(
                        "HmacSHA256"
                );

        javax.crypto.spec.SecretKeySpec secretKey =
                new javax.crypto.spec.SecretKeySpec(
                        secret.getBytes(
                                java.nio.charset.StandardCharsets.UTF_8
                        ),
                        "HmacSHA256"
                );

        mac.init(secretKey);

        byte[] hash =
                mac.doFinal(
                        data.getBytes(
                                java.nio.charset.StandardCharsets.UTF_8
                        )
                );

        StringBuilder hex =
                new StringBuilder();

        for (byte b : hash) {

            hex.append(
                    String.format(
                            "%02x",
                            b
                    )
            );
        }

        return hex.toString();
    }
}