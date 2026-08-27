package vaelis_api.service;

import vaelis_api.dto.AdminModuleResponse;
import vaelis_api.dto.AdminPermissionResponse;
import vaelis_api.entity.AdminModule;
import vaelis_api.entity.AdminPermission;
import vaelis_api.repository.AdminModuleRepository;
import vaelis_api.repository.AdminPermissionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminModuleService {

    private final AdminModuleRepository adminModuleRepository;
    private final AdminPermissionRepository adminPermissionRepository;

    public AdminModuleService(
            AdminModuleRepository adminModuleRepository,
            AdminPermissionRepository adminPermissionRepository) {

        this.adminModuleRepository =
                adminModuleRepository;

        this.adminPermissionRepository =
                adminPermissionRepository;
    }

    // =========================================================
    // ALL ENABLED MODULES
    // =========================================================

    public List<AdminModuleResponse>
    getEnabledModules() {

        return adminModuleRepository
                .findByEnabledTrueOrderByNameAsc()
                .stream()
                .map(AdminModuleResponse::from)
                .toList();
    }

    // =========================================================
    // MODULE BY CODE
    // =========================================================

    public AdminModuleResponse
    getModuleByCode(String code) {

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(
                    "Module code is required."
            );
        }

        AdminModule module =
                adminModuleRepository
                        .findByCodeIgnoreCase(
                                code.trim()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Module not found: "
                                                + code
                                )
                        );

        return AdminModuleResponse.from(module);
    }

    // =========================================================
    // MODULE PERMISSIONS
    // =========================================================

    public List<AdminPermissionResponse>
    getPermissionsForModule(String code) {

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(
                    "Module code is required."
            );
        }

        AdminModule module =
                adminModuleRepository
                        .findByCodeIgnoreCase(
                                code.trim()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Module not found: "
                                                + code
                                )
                        );

        return adminPermissionRepository
                .findByModuleIdAndEnabledTrueOrderByNameAsc(
                        module.getId()
                )
                .stream()
                .map(AdminPermissionResponse::from)
                .toList();
    }

    // =========================================================
    // ALL ENABLED PERMISSIONS
    // =========================================================

    public List<AdminPermissionResponse>
    getEnabledPermissions() {

        return adminPermissionRepository
                .findByEnabledTrueOrderByNameAsc()
                .stream()
                .map(AdminPermissionResponse::from)
                .toList();
    }
}