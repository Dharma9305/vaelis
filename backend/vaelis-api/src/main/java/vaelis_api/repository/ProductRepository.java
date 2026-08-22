package vaelis_api.repository;

import vaelis_api.entity.Product;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, String> {

    Optional<Product> findBySlug(String slug);

    // =========================================================
    // INVENTORY LOCK
    // =========================================================
    //
    // Locks the product row while stock is being checked/
    // modified during payment processing.
    //
    // This prevents two simultaneous payments from consuming
    // the same remaining stock.
    // =========================================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT p
            FROM Product p
            WHERE p.id = :id
            """)
    Optional<Product> findByIdForUpdate(
            @Param("id") String id
    );
}