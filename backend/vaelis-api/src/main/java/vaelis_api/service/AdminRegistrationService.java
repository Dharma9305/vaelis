package vaelis_api.service;

import vaelis_api.dto.AdminRegistrationRequest;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminRegistrationService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminRegistrationService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {

        this.adminUserRepository =
                adminUserRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    // =========================================================
    // REGISTER ADMIN REQUEST
    // =========================================================

    @Transactional
    public AdminUser registerAdmin(
            AdminRegistrationRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Registration request is required."
            );
        }

        String username =
                request.getUsername() == null
                        ? ""
                        : request.getUsername().trim();

        String email =
                request.getEmail() == null
                        ? ""
                        : request.getEmail().trim();

        String password =
                request.getPassword() == null
                        ? ""
                        : request.getPassword();

        // =====================================================
        // VALIDATION
        // =====================================================

        if (username.isBlank()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        if (email.isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        if (password.isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        if (password.length() < 8) {

            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters."
            );
        }

        // =====================================================
        // DUPLICATE USERNAME
        // =====================================================

        if (adminUserRepository
                .findByUsernameIgnoreCase(username)
                .isPresent()) {

            throw new IllegalStateException(
                    "Username is already registered."
            );
        }

        // =====================================================
        // DUPLICATE EMAIL
        // =====================================================

        if (adminUserRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            throw new IllegalStateException(
                    "Email is already registered."
            );
        }

        // =====================================================
        // CREATE ADMIN REQUEST
        // =====================================================

        AdminUser adminUser =
                new AdminUser();

        adminUser.setUsername(
                username
        );

        adminUser.setEmail(
                email
        );

        // =====================================================
        // NEVER STORE PLAIN-TEXT PASSWORD
        // =====================================================

        adminUser.setPassword(
                passwordEncoder.encode(
                        password
                )
        );

        // =====================================================
        // SECURITY: FORCE ADMIN ROLE
        // =====================================================

        adminUser.setRole(
                "ADMIN"
        );

        // =====================================================
        // SECURITY: REQUIRE SUPER ADMIN APPROVAL
        // =====================================================

        adminUser.setApproved(
                false
        );

        adminUser.setApprovedBy(
                null
        );

        adminUser.setApprovedAt(
                null
        );

        // =====================================================
        // SECURITY: DISABLED UNTIL APPROVED
        // =====================================================

        adminUser.setEnabled(
                false
        );

        return adminUserRepository.save(
                adminUser
        );
    }
}