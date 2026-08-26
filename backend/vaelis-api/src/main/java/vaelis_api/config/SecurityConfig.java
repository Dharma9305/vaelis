package vaelis_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final FirebaseAuthenticationFilter
            firebaseAuthenticationFilter;

    private final AdminSessionActivityFilter
            adminSessionActivityFilter;

    public SecurityConfig(
            FirebaseAuthenticationFilter firebaseAuthenticationFilter,
            AdminSessionActivityFilter adminSessionActivityFilter) {

        this.firebaseAuthenticationFilter =
                firebaseAuthenticationFilter;

        this.adminSessionActivityFilter =
                adminSessionActivityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =================================================
            // CORS
            // =================================================

            .cors(cors -> {})

            // =================================================
            // CSRF
            // =================================================

            .csrf(csrf ->
                    csrf.disable()
            )

            // =================================================
            // VAELIS ADMIN SESSION ACTIVITY
            // =================================================

            .addFilterAfter(
                    adminSessionActivityFilter,
                    UsernamePasswordAuthenticationFilter.class
            )

            // =================================================
            // AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                // =================================================
                // CORS PREFLIGHT
                // =================================================

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // =================================================
                // PUBLIC HEALTH API
                // =================================================

                .requestMatchers(
                        "/api/health"
                ).permitAll()

                // =================================================
                // CUSTOMER AUTHENTICATION CHECK
                // =================================================

                .requestMatchers(
                        "/api/auth/customer"
                ).authenticated()

                // =================================================
                // PUBLIC PRODUCT APIs
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/products",
                        "/api/products/**"
                ).permitAll()

                // =================================================
                // ADMIN PRODUCT MANAGEMENT
                // =================================================

                .requestMatchers(
                        "/api/products/admin/**"
                ).hasAnyAuthority(
                        "PRODUCTS_MANAGE",
                        "ROLE_SUPER_ADMIN"
                )

                // =================================================
                // ADMIN ORDER VIEW
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/admin/orders",
                        "/api/admin/orders/*/shipment-history",
                        "/api/admin/orders/*/status-history"
                ).hasAnyAuthority(
                        "ORDERS_VIEW",
                        "ROLE_SUPER_ADMIN"
                )

                // =================================================
                // ADMIN ORDER MANAGEMENT
                // =================================================

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/admin/orders/*/status",
                        "/api/admin/orders/*/payment",
                        "/api/admin/orders/*/shipment"
                ).hasAnyAuthority(
                        "ORDERS_MANAGE",
                        "ROLE_SUPER_ADMIN"
                )

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/admin/orders/*/refund"
                ).hasAnyAuthority(
                        "ORDERS_MANAGE",
                        "ROLE_SUPER_ADMIN"
                )

                // =================================================
                // CUSTOMER ORDER CREATION
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/orders"
                ).hasRole("CUSTOMER")

                // =================================================
                // CUSTOMER ORDER APIs
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/orders",
                        "/api/orders/**"
                ).hasRole("CUSTOMER")

                // =================================================
                // CUSTOMER CANCEL ORDER
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/orders/*/cancel"
                ).hasRole("CUSTOMER")

                // =================================================
                // RAZORPAY / PAYMENT APIs
                // =================================================

                .requestMatchers(
                        "/api/payments/**"
                ).hasRole("CUSTOMER")

                // =================================================
                // SUPER ADMIN APIs
                // =================================================

                .requestMatchers(
                        "/api/super-admin/**"
                ).hasRole("SUPER_ADMIN")

                // =================================================
                // EMPLOYEE RECORD ACCESS
                // =================================================
                //
                // SUPER_ADMIN:
                // Full access.
                //
                // ADMIN / ACCOUNT_MANAGER:
                // Must explicitly have
                // EMPLOYEE_RECORDS_VIEW.
                //
                // EMPLOYEE:
                // No access.
                //
                // =================================================

                .requestMatchers(
                        "/api/admin/employees",
                        "/api/admin/employees/**"
                )
                .hasAnyAuthority(
                        "EMPLOYEE_RECORDS_VIEW",
                        "ROLE_SUPER_ADMIN"
                )

                // =================================================
                // CURRENT ADMIN / EMPLOYEE PROFILE
                // =================================================

                .requestMatchers(
                        "/api/admin/me"
                )
                .hasAnyRole(
                        "ADMIN",
                        "ACCOUNT_MANAGER",
                        "SUPER_ADMIN",
                        "EMPLOYEE"
                )

                // =================================================
                // EMPLOYEE PERMISSION REQUEST CREATION
                // =================================================
                //
                // An EMPLOYEE may REQUEST a permission.
                //
                // This DOES NOT grant the permission.
                //
                // Workflow:
                //
                // EMPLOYEE
                //      ↓
                // PENDING_ACCOUNT_MANAGER
                //      ↓
                // ACCOUNT_MANAGER
                //      ↓
                // PENDING_SUPER_ADMIN
                //      ↓
                // SUPER_ADMIN
                //      ↓
                // APPROVED
                //
                // Only POST is opened here.
                // Approval/rejection endpoints remain protected
                // by the /api/admin/** rule below and their
                // service-level authorization.
                //
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/admin/permission-requests"
                )
                .hasAnyRole(
                        "EMPLOYEE",
                        "ADMIN",
                        "ACCOUNT_MANAGER",
                        "SUPER_ADMIN"
                )

                // =================================================
                // ADMIN APIs
                // =================================================
                //
                // Specific endpoints are handled above.
                //
                // Remaining /api/admin/** requires an
                // administrative role.
                //
                // =================================================

                .requestMatchers(
                        "/api/admin/**"
                )
                .hasAnyRole(
                        "ADMIN",
                        "ACCOUNT_MANAGER",
                        "SUPER_ADMIN"
                )

                // =================================================
                // ADMIN REGISTRATION
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/admin-registration"
                ).permitAll()

                // =================================================
                // EVERYTHING ELSE
                // =================================================

                .anyRequest().authenticated()
            )

            // =================================================
            // FORM LOGIN DISABLED
            // =================================================

            .formLogin(
                    form -> form.disable()
            )

            // =================================================
            // ADMIN BASIC AUTH
            // =================================================

            .httpBasic(
                    Customizer.withDefaults()
            );

        return http.build();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        configuration.setAllowCredentials(
                true
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}