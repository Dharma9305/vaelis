package vaelis_api.controller;
import java.util.List;
import vaelis_api.entity.Order;
import vaelis_api.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Order order) {

        Order savedOrder =
                orderService.createOrder(order);

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/{id}")
public ResponseEntity<Order> getOrder(
        @PathVariable Long id) {

    return orderService
            .getOrderById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() ->
                    ResponseEntity.notFound().build()
            );
}
@GetMapping
public ResponseEntity<List<Order>> getOrders(
        @RequestParam String email) {

    return ResponseEntity.ok(
            orderService.getOrdersByEmail(email)
    );
}
}