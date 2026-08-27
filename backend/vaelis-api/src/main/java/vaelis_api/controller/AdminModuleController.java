package vaelis_api.controller;

import vaelis_api.dto.AdminModuleResponse;
import vaelis_api.dto.AdminPermissionResponse;
import vaelis_api.service.AdminModuleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/modules")
public class AdminModuleController {

    private final AdminModuleService adminModuleService;

    public AdminModuleController(
            AdminModuleService adminModuleService) {

        this.adminModuleService =
                adminModuleService;
    }

    // =========================================================
    // GET ALL ENABLED MODULES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AdminModuleResponse>>
    getModules() {

        return ResponseEntity.ok(
                adminModuleService.getEnabledModules()
        );
    }

    // =========================================================
    // GET MODULE
    // =========================================================

    @GetMapping("/{code}")
    public ResponseEntity<AdminModuleResponse>
    getModule(
            @PathVariable String code) {

        return ResponseEntity.ok(
                adminModuleService.getModuleByCode(code)
        );
    }

    // =========================================================
    // GET MODULE PERMISSIONS
    // =========================================================

    @GetMapping("/{code}/permissions")
    public ResponseEntity<List<AdminPermissionResponse>>
    getModulePermissions(
            @PathVariable String code) {

        return ResponseEntity.ok(
                adminModuleService
                        .getPermissionsForModule(code)
        );
    }
}