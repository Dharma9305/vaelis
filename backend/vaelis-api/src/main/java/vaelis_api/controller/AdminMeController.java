package vaelis_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminMeController {

    // =========================================================
    // CURRENT ADMIN PROFILE
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdmin(
            Authentication authentication) {

        // =====================================================
        // AUTHENTICATION CHECK
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "error",
                                    "Not authenticated"
                            )
                    );
        }

        // =====================================================
        // AUTHORITIES
        // =====================================================

        Collection<? extends GrantedAuthority>
                authorities =
                        authentication.getAuthorities();

        // =====================================================
        // FIND ROLE
        // =====================================================

        String role =
                authorities.stream()
                        .map(
                                GrantedAuthority::getAuthority
                        )
                        .filter(
                                authority ->
                                        authority.startsWith(
                                                "ROLE_"
                                        )
                        )
                        .map(
                                authority ->
                                        authority.substring(5)
                        )
                        .findFirst()
                        .orElse(null);

        // =====================================================
        // FIND PERMISSIONS
        // =====================================================

        List<String> permissions =
                authorities.stream()
                        .map(
                                GrantedAuthority::getAuthority
                        )
                        .filter(
                                authority ->
                                        !authority.startsWith(
                                                "ROLE_"
                                        )
                        )
                        .sorted()
                        .toList();

        // =====================================================
        // RESPONSE
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "username",
                        authentication.getName(),

                        "role",
                        role,

                        "permissions",
                        permissions
                )
        );
    }
}