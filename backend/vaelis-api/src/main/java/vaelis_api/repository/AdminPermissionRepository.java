package vaelis_api.repository;

import vaelis_api.entity.AdminPermission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminPermissionRepository
        extends JpaRepository<AdminPermission, Long> {

    Optional<AdminPermission> findByCodeIgnoreCase(
            String code
    );

    boolean existsByCodeIgnoreCase(
            String code
    );

    List<AdminPermission>
    findByModuleIdAndEnabledTrueOrderByNameAsc(
            Long moduleId
    );

    List<AdminPermission>
    findByEnabledTrueOrderByNameAsc();
}