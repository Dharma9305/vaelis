package vaelis_api.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vaelis_api.service.OrderService;

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
            @PathVariable Long orderId) {

        try {

            vaelis_api.entity.Order vaelisOrder =
                    orderService
                            .getOrderById(orderId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"
                                    )
                            );

            if (vaelisOrder.getTotal() == null ||
                    vaelisOrder.getTotal() <= 0) {

                return ResponseEntity.badRequest()
                        .body("Invalid order amount");
            }

            long amountInPaise =
                    Math.round(
                            vaelisOrder.getTotal() * 100
                    );

            String vaelisOrderId =
                    vaelisOrder.getId().toString();

            String customerEmail =
                    vaelisOrder.getEmail() == null
                            ? ""
                            : vaelisOrder.getEmail();

            // -------------------------------------------------
            // Razorpay order request
            // -------------------------------------------------

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

            // -------------------------------------------------
            // Create Razorpay order
            // -------------------------------------------------

            Order razorpayOrder =
                    razorpayClient.orders.create(
                            orderRequest
                    );

            String razorpayOrderId =
                    razorpayOrder
                            .get("id")
                            .toString();

            // -------------------------------------------------
            // Response
            // -------------------------------------------------

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

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
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
            @RequestBody java.util.Map<String, Object> paymentData) {

        try {

            String vaelisOrderIdText =
                    String.valueOf(
                            paymentData.get(
                                    "vaelisOrderId"
                            )
                    );

            Long vaelisOrderId =
                    Long.valueOf(
                            vaelisOrderIdText
                    );

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

            if (razorpayOrderId.equals("null") ||
                    razorpayPaymentId.equals("null") ||
                    razorpaySignature.equals("null")) {

                return ResponseEntity.badRequest()
                        .body(
                                "Missing Razorpay payment details"
                        );
            }

            String payload =
                    razorpayOrderId
                            + "|"
                            + razorpayPaymentId;

            String secret =
                    System.getenv(
                            "RAZORPAY_KEY_SECRET"
                    );

            if (secret == null ||
                    secret.isBlank()) {

                return ResponseEntity.internalServerError()
                        .body(
                                "Razorpay secret is not configured"
                        );
            }

            String generatedSignature =
                    hmacSha256(
                            payload,
                            secret
                    );

            if (!generatedSignature.equals(
                    razorpaySignature)) {

                return ResponseEntity.badRequest()
                        .body(
                                "Payment signature verification failed"
                        );
            }

            vaelis_api.entity.Order paidOrder =
        orderService.markPaymentAsPaid(
                vaelisOrderId,
                razorpayOrderId,
                razorpayPaymentId
        );

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "success",
                            true,
                            "vaelisOrderId",
                            paidOrder.getId(),
                            "paymentStatus",
                            paidOrder.getPaymentStatus()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(
                            "Unable to verify payment: "
                                    + e.getMessage()
                    );
        }
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