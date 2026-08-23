package vaelis_api.controller;

import vaelis_api.entity.AdminActivityLog;
import vaelis_api.service.AdminActivityLogService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/super-admin/activity-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class SuperAdminActivityLogController {

    private final AdminActivityLogService
            adminActivityLogService;

    public SuperAdminActivityLogController(
            AdminActivityLogService adminActivityLogService) {

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // GET ALL ADMIN ACTIVITY LOGS
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllActivityLogs(
            Authentication authentication) {

        // =====================================================
        // SUPER ADMIN CHECK
        // =====================================================

        if (!isSuperAdmin(authentication)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Only SUPER_ADMIN can view admin activity logs."
                    );
        }

        try {

            List<AdminActivityLog> logs =
                    adminActivityLogService
                            .getAllLogs();

            return ResponseEntity.ok(
                    logs
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Unable to load admin activity logs."
                    );
        }
    }

    // =========================================================
    // SUPER ADMIN CHECK
    // =========================================================

    private boolean isSuperAdmin(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        Collection<? extends GrantedAuthority>
                authorities =
                        authentication.getAuthorities();

        return authorities.stream()
                .anyMatch(authority ->
                        "ROLE_SUPER_ADMIN".equals(
                                authority.getAuthority()
                        )
                );
    }
}