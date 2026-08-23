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
            // FIREBASE CUSTOMER AUTHENTICATION
            // =================================================

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
                //
                // ADMIN requires:
                // PRODUCTS_MANAGE
                //
                // SUPER_ADMIN:
                // Full access
                //
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
                //
                // GET /api/admin/orders
                //
                // GET /api/admin/orders/{id}/shipment-history
                //
                // GET /api/admin/orders/{id}/status-history
                //
                // ADMIN requires:
                // ORDERS_VIEW
                //
                // SUPER_ADMIN:
                // Full access
                //
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
                //
                // PUT status
                // PUT payment
                // PUT shipment
                // POST refund
                //
                // ADMIN requires:
                // ORDERS_MANAGE
                //
                // SUPER_ADMIN:
                // Full access
                //
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
                // ADMIN APIs
                // =================================================
                //
                // Includes:
                //
                // /api/admin/me
                // /api/admin/admin-...
                //
                // Product/order endpoints with specific
                // permissions are already handled ABOVE.
                //
                // =================================================

                .requestMatchers(
                 "/api/admin/**"
                         ).hasAnyRole(
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