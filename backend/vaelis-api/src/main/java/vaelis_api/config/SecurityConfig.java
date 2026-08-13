package vaelis_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // =========================
            // CORS
            // =========================

            .cors(cors -> {})

            // =========================
            // CSRF
            // =========================

            .csrf(csrf -> csrf.disable())

            // =========================
            // AUTHORIZATION
            // =========================

            .authorizeHttpRequests(auth -> auth

                // =========================
                // CORS PREFLIGHT
                // =========================

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // =========================
                // PUBLIC HEALTH API
                // =========================

                .requestMatchers(
                        "/api/health"
                ).permitAll()

                // =========================
                // PUBLIC PRODUCT APIs
                // =========================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/products",
                        "/api/products/**"
                ).permitAll()

                // =========================
                // ADMIN PRODUCT APIs
                // =========================

                .requestMatchers(
                        "/api/products/admin/**"
                ).hasRole("ADMIN")

                // =========================
                // PUBLIC ORDER APIs
                // =========================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/orders"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/orders/**"
                ).permitAll()

                // =========================
                // RAZORPAY
                // =========================

                .requestMatchers(
                        "/api/payments/**"
                ).permitAll()

                // =========================
                // ADMIN APIs
                // =========================

                .requestMatchers(
                        "/api/admin/**"
                ).hasRole("ADMIN")

                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest().authenticated()
            )

            // =========================
            // LOGIN
            // =========================

            .formLogin(form -> form.disable())

            // =========================
            // BASIC AUTH
            // =========================

            .httpBasic(
                    Customizer.withDefaults()
            );

        return http.build();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================

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
                List.of("*")
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