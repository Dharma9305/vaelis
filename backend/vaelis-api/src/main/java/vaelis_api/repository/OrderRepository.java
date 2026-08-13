package vaelis_api.repository;

import vaelis_api.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByEmailOrderByCreatedAtDesc(String email);

    List<Order> findAllByOrderByCreatedAtDesc();
}