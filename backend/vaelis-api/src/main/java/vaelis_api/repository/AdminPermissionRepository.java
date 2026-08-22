package vaelis_api.repository;

import vaelis_api.entity.AdminPermission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminPermissionRepository
        extends JpaRepository<AdminPermission, Long> {

    // =========================================================
    // FIND BY PERMISSION CODE
    // =========================================================

    Optional<AdminPermission> findByCodeIgnoreCase(
            String code
    );

    // =========================================================
    // CHECK EXISTING PERMISSION
    // =========================================================

    boolean existsByCodeIgnoreCase(
            String code
    );
}