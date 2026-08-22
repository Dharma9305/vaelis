package vaelis_api.service;

import com.razorpay.RazorpayClient;
import com.razorpay.Refund;

import org.json.JSONObject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vaelis_api.entity.Order;
import vaelis_api.entity.OrderItem;
import vaelis_api.entity.Product;
import vaelis_api.repository.OrderRepository;
import vaelis_api.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final RazorpayClient razorpayClient;
    private final OrderStatusAuditLogService orderStatusAuditLogService;
    private final OrderShipmentAuditLogService orderShipmentAuditLogService;
    public OrderService(
        OrderRepository orderRepository,
        ProductRepository productRepository,
        EmailService emailService,
        RazorpayClient razorpayClient,
        OrderStatusAuditLogService orderStatusAuditLogService,
        OrderShipmentAuditLogService orderShipmentAuditLogService) {

    this.orderRepository =
            orderRepository;

    this.productRepository =
            productRepository;

    this.emailService =
            emailService;

    this.razorpayClient =
            razorpayClient;

    this.orderStatusAuditLogService =
            orderStatusAuditLogService;

    this.orderShipmentAuditLogService =
            orderShipmentAuditLogService;
}
    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    public Optional<Order> getOrderById(
            Long id) {

        return orderRepository.findById(id);
    }

    // =========================================================
    // GET ORDERS BY EMAIL
    // =========================================================
    public List<Order> getOrdersByEmail(
        String email) {

    if (email == null ||
            email.isBlank()) {

        return List.of();
    }

    return orderRepository
            .findByEmailIgnoreCaseOrderByCreatedAtDesc(
                    email.trim()
            );
        }
// =========================================================
// GET ORDERS BY PHONE
// =========================================================

public List<Order> getOrdersByPhone(
        String phone) {

    return orderRepository
            .findByPhoneOrderByCreatedAtDesc(
                    phone
            );
}
    // =========================================================
    // CREATE ORDER
    // =========================================================

    @Transactional
    public Order createOrder(
            Order order) {

        // =====================================================
        // PHONE VALIDATION
        // =====================================================

        if (order.getPhone() == null ||
                !order.getPhone().matches(
                        "\\d{10}"
                )) {

            throw new IllegalArgumentException(
                    "Phone number must contain exactly 10 digits"
            );
        }

        // =====================================================
        // PINCODE VALIDATION
        // =====================================================

        if (order.getPincode() == null ||
                !order.getPincode().matches(
                        "\\d{6}"
                )) {

            throw new IllegalArgumentException(
                    "Pincode must contain exactly 6 digits"
            );
        }

        // =====================================================
        // LOCATION VALIDATION
        // =====================================================

        if (order.getState() == null ||
                order.getState().isBlank()) {

            throw new IllegalArgumentException(
                    "State is required"
            );
        }

        if (order.getDistrict() == null ||
                order.getDistrict().isBlank()) {

            throw new IllegalArgumentException(
                    "District is required"
            );
        }

        if (order.getCity() == null ||
                order.getCity().isBlank()) {

            throw new IllegalArgumentException(
                    "City is required"
            );
        }

        // =====================================================
        // ITEMS VALIDATION
        // =====================================================

        if (order.getItems() == null ||
                order.getItems().isEmpty()) {

            throw new IllegalArgumentException(
                    "Order must contain at least one item"
            );
        }

        // =====================================================
        // PAYMENT METHOD
        // =====================================================

        String paymentMethod =
                order.getPaymentMethod();

        if (paymentMethod == null ||
                paymentMethod.isBlank()) {

            paymentMethod = "ONLINE";
        }

        paymentMethod =
                paymentMethod
                        .trim()
                        .toUpperCase();

        if (!paymentMethod.equals("ONLINE") &&
                !paymentMethod.equals("COD")) {

            throw new IllegalArgumentException(
                    "Invalid payment method. "
                            + "Allowed values: ONLINE or COD."
            );
        }

        order.setPaymentMethod(
                paymentMethod
        );

        // =====================================================
        // CALCULATE SUBTOTAL
        // =====================================================

        double subtotal = 0.0;

        for (OrderItem item :
                order.getItems()) {

            if (item.getProductId() == null ||
                    item.getProductId().isBlank()) {

                throw new IllegalArgumentException(
                        "Product ID is required"
                );
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Invalid quantity for product: "
                                + item.getProductId()
                );
            }

            Product product =
                    productRepository
                            .findById(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found: "
                                                    + item.getProductId()
                                    )
                            );

            // =================================================
            // STOCK VALIDATION
            // =================================================

            Integer stock =
                    product.getStockQuantity();

            if (Boolean.FALSE.equals(
                    product.getInStock()
            ) ||
                    stock == null ||
                    stock <= 0) {

                throw new IllegalStateException(
                        "Product is currently out of stock: "
                                + product.getName()
                );
            }

            if (item.getQuantity() >
                    stock) {

                throw new IllegalStateException(
                        "Insufficient stock for "
                                + product.getName()
                                + ". Available: "
                                + stock
                );
            }

            // =================================================
            // PRICE SNAPSHOT
            // =================================================

            double price =
                    product.getPrice();

            double itemTotal =
                    price *
                            item.getQuantity();

            item.setProductName(
                    product.getName()
            );

            item.setPrice(
                    price
            );

            item.setTotal(
                    itemTotal
            );

            item.setOrder(
                    order
            );

            subtotal += itemTotal;
        }

        // =====================================================
        // DELIVERY CHARGE
        // =====================================================

        double deliveryCharge =
                subtotal >= 2000 ||
                        subtotal == 0
                        ? 0
                        : 99;

        order.setSubtotal(
                subtotal
        );

        order.setDeliveryCharge(
                deliveryCharge
        );

        order.setTotal(
                subtotal +
                        deliveryCharge
        );

        // =====================================================
        // INITIAL PAYMENT STATUS
        // =====================================================

        order.setPaymentStatus(
                "PENDING"
        );

        // =====================================================
        // COD ORDER
        // =====================================================

        if ("COD".equals(
                paymentMethod
        )) {

            /*
             * COD orders are legitimate orders even though
             * payment is still pending.
             *
             * Stock is reserved/deducted immediately so that
             * another customer cannot purchase the same stock.
             */

            reserveStockForCodOrder(
                    order
            );

            order.setOrderStatus(
                    "CONFIRMED"
            );

        } else {

            // =================================================
            // ONLINE ORDER
            // =================================================
            //
            // Stock is NOT deducted here.
            //
            // Stock will be deducted only after Razorpay
            // payment verification succeeds.
            // =================================================

            order.setOrderStatus(
                    "PLACED"
            );
        }

        Order savedOrder =
                orderRepository.save(
                        order
                );


        // =====================================================
        // COD CONFIRMATION EMAIL
        // =====================================================

        if ("COD".equals(
                paymentMethod
        )) {

            try {

                emailService
                        .sendOrderConfirmationEmail(
                                savedOrder
                        );

            } catch (Exception e) {

                System.err.println(
                        "COD confirmation email could not be sent: "
                                + e.getMessage()
                );

                e.printStackTrace();
            }
        }

        return savedOrder;
    }

    // =========================================================
    // RESERVE STOCK FOR COD
    // =========================================================

    private void reserveStockForCodOrder(
            Order order) {

        List<OrderItem> items =
                new ArrayList<>(
                        order.getItems()
                );

        /*
         * Always lock products in the same order.
         *
         * This reduces the possibility of deadlocks when
         * multiple customers place orders simultaneously.
         */

        items.sort(
                Comparator.comparing(
                        OrderItem::getProductId
                )
        );

        for (OrderItem item :
                items) {

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Invalid quantity for product: "
                                + item.getProductId()
                );
            }

            Product product =
                    productRepository
                            .findByIdForUpdate(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found: "
                                                    + item.getProductId()
                                    )
                            );

            Integer currentStock =
                    product.getStockQuantity();

            if (Boolean.FALSE.equals(
                    product.getInStock()
            ) ||
                    currentStock == null ||
                    currentStock <= 0) {

                throw new IllegalStateException(
                        "Product is out of stock: "
                                + product.getName()
                );
            }

            if (item.getQuantity() >
                    currentStock) {

                throw new IllegalStateException(
                        "Insufficient stock for "
                                + product.getName()
                                + ". Available: "
                                + currentStock
                );
            }

            int remainingStock =
                    currentStock -
                            item.getQuantity();

            product.setStockQuantity(
                    remainingStock
            );

            product.setInStock(
                    remainingStock > 0
            );

            productRepository.save(
                    product
            );
        }
    }

    // =========================================================
    // MARK PAYMENT AS PAID
    // =========================================================

    @Transactional
    public Order markPaymentAsPaid(
            Long orderId,
            String razorpayOrderId,
            String razorpayPaymentId) {

        // =====================================================
        // LOCK ORDER
        // =====================================================

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

        // =====================================================
        // IDEMPOTENCY
        // =====================================================

        if ("PAID".equalsIgnoreCase(
                order.getPaymentStatus()
        )) {

            return order;
        }

        // =====================================================
        // RAZORPAY VALIDATION
        // =====================================================

        if (razorpayOrderId == null ||
                razorpayOrderId.isBlank()) {

            throw new IllegalArgumentException(
                    "Razorpay order ID is required"
            );
        }

        if (razorpayPaymentId == null ||
                razorpayPaymentId.isBlank()) {

            throw new IllegalArgumentException(
                    "Razorpay payment ID is required"
            );
        }

        // =====================================================
        // SORT ITEMS
        // =====================================================

        List<OrderItem> items =
                new ArrayList<>(
                        order.getItems()
                );

        items.sort(
                Comparator.comparing(
                        OrderItem::getProductId
                )
        );

        // =====================================================
        // LOCK PRODUCTS + RECHECK STOCK
        // =====================================================

        for (OrderItem item :
                items) {

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Invalid quantity for product: "
                                + item.getProductId()
                );
            }

            Product product =
                    productRepository
                            .findByIdForUpdate(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found: "
                                                    + item.getProductId()
                                    )
                            );

            Integer currentStock =
                    product.getStockQuantity();

            if (Boolean.FALSE.equals(
                    product.getInStock()
            ) ||
                    currentStock == null ||
                    currentStock <= 0) {

                throw new IllegalStateException(
                        "Product is out of stock: "
                                + product.getName()
                );
            }

            if (item.getQuantity() >
                    currentStock) {

                throw new IllegalStateException(
                        "Insufficient stock for "
                                + product.getName()
                                + ". Available: "
                                + currentStock
                );
            }

            int remainingStock =
                    currentStock -
                            item.getQuantity();

            product.setStockQuantity(
                    remainingStock
            );

            product.setInStock(
                    remainingStock > 0
            );

            productRepository.save(
                    product
            );
        }

        // =====================================================
        // SAVE RAZORPAY DETAILS
        // =====================================================

        order.setRazorpayOrderId(
                razorpayOrderId
        );

        order.setRazorpayPaymentId(
                razorpayPaymentId
        );

        // =====================================================
        // PAYMENT STATUS
        // =====================================================

        order.setPaymentStatus(
                "PAID"
        );

        // =====================================================
        // PAYMENT METHOD
        // =====================================================

        order.setPaymentMethod(
                "ONLINE"
        );

        // =====================================================
        // ORDER STATUS
        // =====================================================

        order.setOrderStatus(
                "CONFIRMED"
        );

        Order savedOrder =
                orderRepository.save(
                        order
                );

        // =====================================================
        // CONFIRMATION EMAIL
        // =====================================================

        try {

            emailService
                    .sendOrderConfirmationEmail(
                            savedOrder
                    );

        } catch (Exception e) {

            System.err.println(
                    "Order confirmation email could not be sent: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }

        return savedOrder;
    }
        // =========================================================
// RECORD MANUAL PAYMENT RECEIVED
// =========================================================
//
// Supported manual payment methods:
//
// COD    -> Cash collected
// UPI    -> UPI payment received
// ONLINE -> Online/bank transfer received
//
// Razorpay payments should continue through
// markPaymentAsPaid() and /api/payments/verify.
//
// =========================================================

@Transactional
public Order recordPaymentReceived(
        Long orderId,
        String paymentMethod) {

    // =====================================================
    // LOCK ORDER
    // =====================================================

    Order order =
            orderRepository
                    .findByIdForUpdate(
                            orderId
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Order not found: "
                                            + orderId
                            )
                    );

    // =====================================================
    // VALIDATE PAYMENT METHOD
    // =====================================================

    if (paymentMethod == null ||
            paymentMethod.isBlank()) {

        throw new IllegalArgumentException(
                "Payment method is required"
        );
    }

    paymentMethod =
            paymentMethod
                    .trim()
                    .toUpperCase();

    // =====================================================
    // ALLOWED MANUAL PAYMENT METHODS
    // =====================================================

    if (!paymentMethod.equals("COD") &&
            !paymentMethod.equals("UPI") &&
            !paymentMethod.equals("ONLINE")) {

        throw new IllegalArgumentException(
                "Invalid payment method. "
                        + "Allowed values: COD, UPI or ONLINE."
        );
    }

    // =====================================================
    // ALREADY PAID
    // =====================================================

    if ("PAID".equalsIgnoreCase(
            order.getPaymentStatus()
    )) {

        throw new IllegalStateException(
                "Payment has already been received for this order."
        );
    }

    // =====================================================
    // VALIDATE ORDER STATUS
    // =====================================================

    String currentOrderStatus =
            order.getOrderStatus();

    if (currentOrderStatus == null ||
            currentOrderStatus.isBlank()) {

        currentOrderStatus =
                "PLACED";

    } else {

        currentOrderStatus =
                currentOrderStatus
                        .trim()
                        .toUpperCase();
    }

    // =====================================================
    // CANCELLED ORDER
    // =====================================================

    if ("CANCELLED".equals(
            currentOrderStatus
    )) {

        throw new IllegalStateException(
                "Payment cannot be received for a cancelled order."
        );
    }

    // =====================================================
    // DELIVERED ORDER
    // =====================================================
    //
    // Delivered COD orders can still have payment pending
    // only if payment collection was missed.
    //
    // Therefore we allow recording payment after delivery.
    // =====================================================

    // No rejection here intentionally.

    // =====================================================
    // RECORD PAYMENT METHOD
    // =====================================================

    order.setPaymentMethod(
            paymentMethod
    );

    // =====================================================
    // RECORD PAYMENT STATUS
    // =====================================================

    order.setPaymentStatus(
            "PAID"
    );

    // =====================================================
    // RAZORPAY DETAILS
    // =====================================================
    //
    // Manual payments do NOT receive Razorpay IDs.
    //
    // Do not overwrite existing Razorpay IDs if they exist.
    // =====================================================

    // Intentionally left unchanged.

    // =====================================================
    // SAVE
    // =====================================================

    Order savedOrder =
            orderRepository.save(
                    order
            );

    System.out.println(
            "Payment received manually: Order #"
                    + savedOrder.getId()
                    + " | Method: "
                    + paymentMethod
                    + " | Amount: â‚¹"
                    + savedOrder.getTotal()
    );

    return savedOrder;
}
    // =========================================================
// UPDATE ORDER STATUS
// =========================================================

@Transactional
public Order updateOrderStatus(
        Long orderId,
        String orderStatus) {

    // =====================================================
    // LOCK ORDER
    // =====================================================

    Order order =
            orderRepository
                    .findByIdForUpdate(
                            orderId
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Order not found: "
                                            + orderId
                            )
                    );

    // =====================================================
    // STATUS VALIDATION
    // =====================================================

    if (orderStatus == null ||
            orderStatus.isBlank()) {

        throw new IllegalArgumentException(
                "Order status is required"
        );
    }

    orderStatus =
            orderStatus
                    .trim()
                    .toUpperCase();

    // =====================================================
    // CURRENT STATUS
    // =====================================================

    String currentStatus =
            order.getOrderStatus();

    if (currentStatus == null ||
            currentStatus.isBlank()) {

        currentStatus =
                "PLACED";

    } else {

        currentStatus =
                currentStatus
                        .trim()
                        .toUpperCase();
    }

    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    String paymentStatus =
            order.getPaymentStatus();

    if (paymentStatus == null ||
            paymentStatus.isBlank()) {

        paymentStatus =
                "PENDING";

    } else {

        paymentStatus =
                paymentStatus
                        .trim()
                        .toUpperCase();
    }

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    String paymentMethod =
            order.getPaymentMethod();

    if (paymentMethod == null ||
            paymentMethod.isBlank()) {

        paymentMethod =
                "ONLINE";

    } else {

        paymentMethod =
                paymentMethod
                        .trim()
                        .toUpperCase();
    }

    // =====================================================
    // VALID STATUS VALUES
    // =====================================================

    if (!orderStatus.equals("PENDING") &&
            !orderStatus.equals("PLACED") &&
            !orderStatus.equals("CONFIRMED") &&
            !orderStatus.equals("PROCESSING") &&
            !orderStatus.equals("SHIPPED") &&
            !orderStatus.equals("DELIVERED") &&
            !orderStatus.equals("CANCELLED")) {

        throw new IllegalArgumentException(
                "Invalid order status: "
                        + orderStatus
        );
    }

    // =====================================================
    // PAYMENT SECURITY
    // =====================================================

    boolean paid =
            "PAID".equals(
                    paymentStatus
            );

    boolean cod =
            "COD".equals(
                    paymentMethod
            );

    if (!paid &&
            !cod &&
            (
                    orderStatus.equals(
                            "CONFIRMED"
                    ) ||
                    orderStatus.equals(
                            "PROCESSING"
                    ) ||
                    orderStatus.equals(
                            "SHIPPED"
                    ) ||
                    orderStatus.equals(
                            "DELIVERED"
                    )
            )) {

        throw new IllegalStateException(
                "Online payment is PENDING. "
                        + "Payment must be completed before "
                        + "the order can be "
                        + orderStatus
                        + "."
        );
    }

    // =====================================================
    // TERMINAL STATUS
    // =====================================================

    if ("CANCELLED".equals(
            currentStatus
    )) {

        throw new IllegalStateException(
                "Cancelled orders cannot be updated."
        );
    }

    if ("DELIVERED".equals(
            currentStatus
    )) {

        throw new IllegalStateException(
                "Delivered orders cannot be updated."
        );
    }

    // =====================================================
    // SAME STATUS
    // =====================================================

    if (currentStatus.equals(
            orderStatus
    )) {

        return order;
    }

    // =====================================================
    // VALID TRANSITIONS
    // =====================================================

    boolean validTransition =
            switch (currentStatus) {

                case "PENDING",
                     "PLACED" ->

                        orderStatus.equals(
                                "CONFIRMED"
                        ) ||
                        orderStatus.equals(
                                "CANCELLED"
                        );

                case "CONFIRMED" ->

                        orderStatus.equals(
                                "PROCESSING"
                        ) ||
                        orderStatus.equals(
                                "CANCELLED"
                        );

                case "PROCESSING" ->

                        orderStatus.equals(
                                "SHIPPED"
                        ) ||
                        orderStatus.equals(
                                "CANCELLED"
                        );

                case "SHIPPED" ->

                        orderStatus.equals(
                                "DELIVERED"
                        );

                case "DELIVERED",
                     "CANCELLED" ->

                        false;

                default ->

                        false;
            };

    if (!validTransition) {

        throw new IllegalStateException(
                "Invalid order status transition: "
                        + currentStatus
                        + " -> "
                        + orderStatus
        );
    }

    // =====================================================
    // SHIPPING DETAILS REQUIRED
    // =====================================================

    if ("SHIPPED".equals(
            orderStatus
    )) {

        if (order.getShippingPartner() == null ||
                order.getShippingPartner()
                        .isBlank()) {

            throw new IllegalStateException(
                    "Shipping partner is required before "
                            + "marking the order as SHIPPED."
            );
        }

        if (order.getTrackingNumber() == null ||
                order.getTrackingNumber()
                        .isBlank()) {

            throw new IllegalStateException(
                    "Tracking number is required before "
                            + "marking the order as SHIPPED."
            );
        }
    }

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    if ("CANCELLED".equals(
            orderStatus
    )) {

        /*
         * ONLINE PAID orders:
         *     Stock was deducted after payment.
         *     Restore stock.
         *     Refund becomes required.
         *
         * COD orders:
         *     Stock was deducted when the COD order
         *     was created.
         *     Restore stock.
         *     No refund because payment was never made.
         *
         * ONLINE PENDING orders:
         *     Stock was never deducted.
         *     Nothing to restore.
         */

        if (paid) {

            restoreOrderStock(
                    order
            );

            order.setRefundStatus(
                    "REFUND_REQUIRED"
            );

        } else if (cod) {

            restoreOrderStock(
                    order
            );

            order.setRefundStatus(
                    "NONE"
            );

        } else {

            order.setRefundStatus(
                    "NONE"
            );
        }
    }

    // =====================================================
    // SAVE ORDER
    // =====================================================

    order.setOrderStatus(
            orderStatus
    );

    Order savedOrder =
            orderRepository.save(
                    order
            );

    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================
    //
    // IMPORTANT:
    // We use the status captured BEFORE the update:
    //
    // currentStatus -> orderStatus
    //
    // The audit service gets the authenticated user
    // directly from Spring Security.
    //
    // We do NOT accept the username from the frontend.
    // =====================================================

    orderStatusAuditLogService.logStatusChange(
            savedOrder.getId(),
            currentStatus,
            orderStatus
    );

    /*
     * IMPORTANT:
     *
     * Status email is NOT sent here.
     *
     * AdminOrderController handles status email.
     *
     * This prevents duplicate emails.
     */

    return savedOrder;
}


    // =========================================================
    // RESTORE STOCK
    // =========================================================

    private void restoreOrderStock(
            Order order) {

        if (order.getItems() == null ||
                order.getItems().isEmpty()) {

            return;
        }

        List<OrderItem> items =
                new ArrayList<>(
                        order.getItems()
                );

        items.sort(
                Comparator.comparing(
                        OrderItem::getProductId
                )
        );

        for (OrderItem item :
                items) {

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                continue;
            }

            Product product =
                    productRepository
                            .findByIdForUpdate(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found while "
                                                    + "restoring stock: "
                                                    + item.getProductId()
                                    )
                            );

            int currentStock =
                    product.getStockQuantity() == null
                            ? 0
                            : product.getStockQuantity();

            int restoredStock =
                    currentStock +
                            item.getQuantity();

            product.setStockQuantity(
                    restoredStock
            );

            product.setInStock(
                    restoredStock > 0
            );

            productRepository.save(
                    product
            );
        }
    }

    // =========================================================
    // PROCESS REFUND
    // =========================================================

    @Transactional
    public Order processRefund(
            Long orderId) {

        // =====================================================
        // LOCK ORDER
        // =====================================================

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

        // =====================================================
        // ORDER MUST BE CANCELLED
        // =====================================================

        if (!"CANCELLED".equals(
                order.getOrderStatus()
        )) {

            throw new IllegalStateException(
                    "Only cancelled orders can be refunded."
            );
        }

        // =====================================================
        // PAYMENT MUST BE PAID
        // =====================================================

        if (!"PAID".equalsIgnoreCase(
                order.getPaymentStatus()
        )) {

            throw new IllegalStateException(
                    "Only paid orders can be refunded."
            );
        }

        // =====================================================
        // REFUND MUST BE REQUIRED
        // =====================================================

        if (!"REFUND_REQUIRED".equals(
                order.getRefundStatus()
        )) {

            throw new IllegalStateException(
                    "Order is not eligible for refund."
            );
        }

        // =====================================================
        // RAZORPAY PAYMENT ID
        // =====================================================

        if (order.getRazorpayPaymentId() == null ||
                order.getRazorpayPaymentId()
                        .isBlank()) {

            throw new IllegalStateException(
                    "Razorpay payment ID is missing."
            );
        }

        // =====================================================
        // ORDER AMOUNT
        // =====================================================

        if (order.getTotal() == null ||
                order.getTotal() <= 0) {

            throw new IllegalStateException(
                    "Invalid order amount."
            );
        }

        // =====================================================
        // REFUND INITIATED
        // =====================================================

        order.setRefundStatus(
                "REFUND_INITIATED"
        );

        order.setRefundInitiatedAt(
                LocalDateTime.now()
        );

        orderRepository.save(
                order
        );

        try {

            long amountInPaise =
                    Math.round(
                            order.getTotal() *
                                    100
                    );

            JSONObject refundRequest =
                    new JSONObject();

            refundRequest.put(
                    "amount",
                    amountInPaise
            );

            refundRequest.put(
                    "receipt",
                    "VAELIS-REFUND-"
                            + order.getId()
            );

            JSONObject notes =
                    new JSONObject();

            notes.put(
                    "vaelis_order_id",
                    order.getId()
                            .toString()
            );

            notes.put(
                    "customer_email",
                    order.getEmail() == null
                            ? ""
                            : order.getEmail()
            );

            refundRequest.put(
                    "notes",
                    notes
            );

            // =================================================
            // RAZORPAY REFUND
            // =================================================

            Refund refund =
                    razorpayClient
                            .payments
                            .refund(
                                    order.getRazorpayPaymentId(),
                                    refundRequest
                            );

            // =================================================
            // REFUND ID
            // =================================================

            String refundId =
                    refund.get(
                            "id"
                    ).toString();

            order.setRazorpayRefundId(
                    refundId
            );

            // =================================================
            // REFUNDED AMOUNT
            // =================================================

            Object refundAmountObject =
                    refund.get(
                            "amount"
                    );

            if (refundAmountObject
                    instanceof Number) {

                order.setRefundedAmount(
                        (
                                (
                                        Number
                                )
                                        refundAmountObject
                        )
                                .doubleValue()
                                / 100.0
                );

            } else {

                order.setRefundedAmount(
                        order.getTotal()
                );
            }

            // =================================================
            // REFUND STATUS
            // =================================================

            Object refundStatusObject =
                    refund.get(
                            "status"
                    );

            String razorpayRefundStatus =
                    refundStatusObject == null
                            ? ""
                            : refundStatusObject
                                    .toString();

            if ("processed".equalsIgnoreCase(
                    razorpayRefundStatus
            )) {

                order.setRefundStatus(
                        "REFUNDED"
                );

            } else {

                order.setRefundStatus(
                        "REFUND_INITIATED"
                );
            }

            return orderRepository.save(
                    order
            );

        } catch (Exception e) {

            order.setRefundStatus(
                    "REFUND_FAILED"
            );

            orderRepository.save(
                    order
            );

            throw new RuntimeException(
                    "Unable to process refund: "
                            + e.getMessage(),
                    e
            );
        }
    }

    // =========================================================
    // UPDATE SHIPMENT
    // =========================================================

    @Transactional
    public Order updateShipment(
            Long orderId,
            String shippingPartner,
            String trackingNumber,
            String trackingUrl,
            String expectedDeliveryDate) {

        // =====================================================
        // LOCK ORDER
        // =====================================================

        Order order =
                orderRepository
                        .findByIdForUpdate(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

        String currentStatus =
                order.getOrderStatus();

        // =====================================================
        // SHIPMENT STATUS
        // =====================================================

        if (!"PROCESSING".equals(
                currentStatus
        ) &&
                !"SHIPPED".equals(
                        currentStatus
                )) {

            throw new IllegalStateException(
                    "Shipment can only be added or updated "
                            + "for orders in PROCESSING or SHIPPED status."
            );
        }

        // =====================================================
        // PAYMENT STATUS
        // =====================================================
        //
        // Online orders must be PAID.
        //
        // COD orders are allowed to ship while payment
        // remains PENDING because payment is collected
        // on delivery.
        // =====================================================

        String paymentMethod =
                order.getPaymentMethod();

        boolean isCod =
                "COD".equalsIgnoreCase(
                        paymentMethod
                );

        if (!isCod &&
                !"PAID".equalsIgnoreCase(
                        order.getPaymentStatus()
                )) {

            throw new IllegalStateException(
                    "Only paid online orders can have "
                            + "shipment details."
            );
        }

        // =====================================================
        // SHIPPING PARTNER
        // =====================================================

        if (shippingPartner == null ||
                shippingPartner.isBlank()) {

            throw new IllegalArgumentException(
                    "Shipping partner is required"
            );
        }

        // =====================================================
        // TRACKING NUMBER
        // =====================================================

        if (trackingNumber == null ||
                trackingNumber.isBlank()) {

            throw new IllegalArgumentException(
                    "Tracking number is required"
            );
        }

        order.setShippingPartner(
                shippingPartner.trim()
        );

        order.setTrackingNumber(
                trackingNumber.trim()
        );

        // =====================================================
        // TRACKING URL
        // =====================================================

        if (trackingUrl != null &&
                !trackingUrl.isBlank()) {

            order.setTrackingUrl(
                    trackingUrl.trim()
            );

        } else {

            order.setTrackingUrl(
                    null
            );
        }

        // =====================================================
        // EXPECTED DELIVERY DATE
        // =====================================================

        if (expectedDeliveryDate != null &&
                !expectedDeliveryDate.isBlank()) {

            try {

                order.setExpectedDeliveryDate(
                        LocalDate.parse(
                                expectedDeliveryDate.trim()
                        )
                );

            } catch (
                    DateTimeParseException e
            ) {

                throw new IllegalArgumentException(
                        "Invalid expected delivery date. "
                                + "Use YYYY-MM-DD format."
                );
            }

        } else {

            order.setExpectedDeliveryDate(
                    null
            );
        }

        Order savedOrder =
        orderRepository.save(
                order
        );

// =========================================================
// SHIPMENT AUDIT LOG
// =========================================================

orderShipmentAuditLogService.logShipmentUpdate(
        savedOrder.getId(),
        savedOrder.getShippingPartner(),
        savedOrder.getTrackingNumber(),
        savedOrder.getTrackingUrl(),
        savedOrder.getExpectedDeliveryDate()
);

return savedOrder;
    }
}
