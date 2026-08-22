package vaelis_api.repository;

import vaelis_api.entity.Order;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // =========================================================
    // ORDERS BY CUSTOMER EMAIL
    // =========================================================
    //
    // Ignore email case because Firebase may return:
    //
    // darpaninfratech01@gmail.com
    //
    // while the database may contain:
    //
    // Darpaninfratech01@gmail.com
    //
    // =========================================================

    List<Order> findByEmailIgnoreCaseOrderByCreatedAtDesc(
            String email
    );

    // =========================================================
    // ORDERS BY CUSTOMER PHONE
    // =========================================================

    List<Order> findByPhoneOrderByCreatedAtDesc(
            String phone
    );

    // =========================================================
    // ALL ORDERS
    // =========================================================

    List<Order> findAllByOrderByCreatedAtDesc();

    // =========================================================
    // ORDER LOCK
    // =========================================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT o
            FROM Order o
            WHERE o.id = :id
            """)
    Optional<Order> findByIdForUpdate(
            @Param("id") Long id
    );
}