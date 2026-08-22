package vaelis_api.config;

import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner createInitialSuperAdmin(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // =================================================
            // CREATE INITIAL SUPER ADMIN ONLY IF NOT PRESENT
            // =================================================

            if (adminUserRepository
                    .findByUsernameIgnoreCase("admin")
                    .isPresent()) {

                return;
            }

            AdminUser superAdmin =
                    new AdminUser();

            superAdmin.setUsername("admin");

            superAdmin.setEmail(
                    "admin@vaelis.com"
            );

            superAdmin.setPassword(
                    passwordEncoder.encode(
                            "admin123"
                    )
            );

            // =================================================
            // SUPER ADMIN
            // =================================================

            superAdmin.setRole(
                    "SUPER_ADMIN"
            );

            // =================================================
            // SUPER ADMIN IS PRE-APPROVED
            // =================================================

            superAdmin.setApproved(true);

            superAdmin.setApprovedBy(
                    "SYSTEM"
            );

            superAdmin.setApprovedAt(
                    java.time.LocalDateTime.now()
            );

            superAdmin.setEnabled(true);

            adminUserRepository.save(
                    superAdmin
            );

            System.out.println(
                    "================================================="
            );

            System.out.println(
                    "VAELIS INITIAL SUPER ADMIN CREATED"
            );

            System.out.println(
                    "Username: admin"
            );

            System.out.println(
                    "Password: admin123"
            );

            System.out.println(
                    "Role: SUPER_ADMIN"
            );

            System.out.println(
                    "Approved: true"
            );

            System.out.println(
                    "================================================="
            );
        };
    }
}