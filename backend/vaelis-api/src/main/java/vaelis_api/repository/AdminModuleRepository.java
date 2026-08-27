package vaelis_api.repository;

import vaelis_api.entity.AdminModule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminModuleRepository
        extends JpaRepository<AdminModule, Long> {

    Optional<AdminModule> findByCodeIgnoreCase(
            String code
    );

    boolean existsByCodeIgnoreCase(
            String code
    );

    List<AdminModule>
    findByEnabledTrueOrderByNameAsc();
}