package vaelis_api.controller;

import vaelis_api.dto.AdminRegistrationRequest;
import vaelis_api.dto.AdminUserResponse;
import vaelis_api.entity.AdminUser;
import vaelis_api.service.AdminRegistrationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin-registration")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminRegistrationController {

    private final AdminRegistrationService
            adminRegistrationService;

    public AdminRegistrationController(
            AdminRegistrationService
                    adminRegistrationService) {

        this.adminRegistrationService =
                adminRegistrationService;
    }

    // =========================================================
    // ADMIN REGISTRATION REQUEST
    // =========================================================

    @PostMapping
    public ResponseEntity<?> registerAdmin(
            @RequestBody AdminRegistrationRequest request) {

        try {

            AdminUser adminUser =
                    adminRegistrationService
                            .registerAdmin(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            new AdminUserResponse(
                                    adminUser
                            )
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.CONFLICT
                    )
                    .body(
                            e.getMessage()
                    );
        }
    }
}