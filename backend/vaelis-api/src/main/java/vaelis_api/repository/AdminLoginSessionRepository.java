package vaelis_api.repository;

import vaelis_api.entity.AdminLoginSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminLoginSessionRepository
        extends JpaRepository<AdminLoginSession, Long> {

    // =========================================================
    // ACTIVE SESSION FOR USER
    // =========================================================

    Optional<AdminLoginSession>
    findFirstByUsernameIgnoreCaseAndStatusOrderByLoginAtDesc(
            String username,
            String status
    );

    // =========================================================
    // ALL USER SESSIONS
    // =========================================================

    List<AdminLoginSession>
    findByUsernameIgnoreCaseOrderByLoginAtDesc(
            String username
    );

    // =========================================================
    // ALL SESSIONS
    // =========================================================

    List<AdminLoginSession>
    findAllByOrderByLoginAtDesc();
}