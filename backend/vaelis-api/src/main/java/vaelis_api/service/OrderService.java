package vaelis_api.service;

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

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            EmailService emailService) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    public Optional<Order> getOrderById(Long id) {

        return orderRepository.findById(id);
    }

    // =========================================================
    // GET ORDERS BY EMAIL
    // =========================================================

    public List<Order> getOrdersByEmail(
            String email) {

        return orderRepository
                .findByEmailOrderByCreatedAtDesc(email);
    }

    // =========================================================
    // CREATE ORDER
    // =========================================================

    @Transactional
    public Order createOrder(Order order) {

    // =========================
    // PHONE VALIDATION
    // =========================

        if (order.getPhone() == null ||
                !order.getPhone().matches("\\d{10}")) {

            throw new IllegalArgumentException(
                    "Phone number must contain exactly 10 digits"
            );
        }
        
    // =========================
    // PINCODE VALIDATION
    // =========================

        if (order.getPincode() == null ||
        !order.getPincode().matches("\\d{6}")) {

    throw new IllegalArgumentException(
            "Pincode must contain exactly 6 digits"
    );
}

                // =========================
    // LOCATION VALIDATION
    // =========================

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


        double subtotal = 0.0;

        for (OrderItem item : order.getItems()) {

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

            if (!product.getInStock()) {

                throw new RuntimeException(
                        "Product is currently out of stock: "
                                + product.getName()
                );
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid quantity for product: "
                                + product.getName()
                );
            }

            double price =
                    product.getPrice();

            double itemTotal =
                    price * item.getQuantity();

            item.setProductName(
                    product.getName()
            );

            item.setPrice(price);

            item.setTotal(itemTotal);

            subtotal += itemTotal;

            item.setOrder(order);
        }

        // =====================================================
        // DELIVERY CHARGE
        // =====================================================

        double deliveryCharge =
                subtotal >= 2000 ||
                        subtotal == 0
                        ? 0
                        : 99;

        order.setSubtotal(subtotal);

        order.setDeliveryCharge(
                deliveryCharge
        );

        order.setTotal(
                subtotal + deliveryCharge
        );

        // =====================================================
        // INITIAL STATUS
        // =====================================================

        order.setPaymentStatus(
                "PENDING"
        );

        order.setOrderStatus(
                "PLACED"
        );

        return orderRepository.save(order);
    }

    // =========================================================
    // MARK PAYMENT AS PAID
    // =========================================================

    @Transactional
    public Order markPaymentAsPaid(
            Long orderId,
            String razorpayOrderId,
            String razorpayPaymentId) {

        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

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
        // ORDER STATUS
        // =====================================================

        order.setOrderStatus(
                "CONFIRMED"
        );

        Order savedOrder =
                orderRepository.save(order);

        // =====================================================
        // SEND ORDER CONFIRMATION EMAIL
        // =====================================================

        try {

            emailService.sendOrderConfirmationEmail(
                    savedOrder
            );

        } catch (Exception e) {

            /*
             * IMPORTANT:
             *
             * Payment has already been verified
             * successfully.
             *
             * If email sending fails, the payment
             * must NOT be treated as failed.
             */

            System.err.println(
                    "Order confirmation email could not be sent: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }

        return savedOrder;
    }

    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @Transactional
    public Order updateOrderStatus(
            Long orderId,
            String orderStatus) {

        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

        if (!orderStatus.equals("PLACED") &&
                !orderStatus.equals("CONFIRMED") &&
                !orderStatus.equals("PROCESSING") &&
                !orderStatus.equals("SHIPPED") &&
                !orderStatus.equals("DELIVERED") &&
                !orderStatus.equals("CANCELLED")) {

            throw new IllegalArgumentException(
                    "Invalid order status"
            );
        }

        order.setOrderStatus(
                orderStatus
        );

        Order savedOrder =
                orderRepository.save(order);

        // =====================================================
        // STATUS UPDATE EMAIL
        // =====================================================

        try {

            emailService.sendOrderStatusEmail(
                    savedOrder
            );

        } catch (Exception e) {

            System.err.println(
                    "Order status email could not be sent: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }

        return savedOrder;
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

        Order order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found: "
                                                + orderId
                                )
                        );

        order.setShippingPartner(
                shippingPartner
        );

        order.setTrackingNumber(
                trackingNumber
        );

        order.setTrackingUrl(
                trackingUrl
        );

        if (expectedDeliveryDate != null &&
                !expectedDeliveryDate.isBlank()) {

            try {

                order.setExpectedDeliveryDate(
                        java.time.LocalDate.parse(
                                expectedDeliveryDate
                        )
                );

            } catch (
                    java.time.format.DateTimeParseException e
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
                orderRepository.save(order);

        return savedOrder;
    }
}