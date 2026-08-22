package vaelis_api.controller;

import vaelis_api.config.FirebaseAuthenticationFilter.CustomerPrincipal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerAuthController {

    // =========================================================
    // CUSTOMER AUTHENTICATION CHECK
    // =========================================================

    @GetMapping("/customer")
    public ResponseEntity<?> getCustomer(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "error",
                                    "Customer is not authenticated."
                            )
                    );
        }

        Object principal =
                authentication.getPrincipal();

        if (!(principal instanceof CustomerPrincipal)) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "error",
                                    "Authenticated user is not a customer."
                            )
                    );
        }

        CustomerPrincipal customer =
                (CustomerPrincipal) principal;

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "authenticated",
                true
        );

        response.put(
                "uid",
                customer.getUid()
        );

        response.put(
                "email",
                customer.getEmail()
        );

        response.put(
                "phoneNumber",
                customer.getPhoneNumber()
        );

        response.put(
                "role",
                "CUSTOMER"
        );

        return ResponseEntity.ok(
                response
        );
    }
}