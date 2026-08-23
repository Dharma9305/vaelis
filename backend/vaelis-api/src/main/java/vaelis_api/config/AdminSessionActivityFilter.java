package vaelis_api.config;

import vaelis_api.service.AdminLoginSessionService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AdminSessionActivityFilter
        extends OncePerRequestFilter {

    private final AdminLoginSessionService
            adminLoginSessionService;

    public AdminSessionActivityFilter(
            AdminLoginSessionService adminLoginSessionService) {

        this.adminLoginSessionService =
                adminLoginSessionService;
    }

    // =========================================================
    // FILTER
    // =========================================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        // =====================================================
        // ONLY PROCESS AUTHENTICATED ADMIN USERS
        // =====================================================

        if (authentication != null &&
                authentication.isAuthenticated() &&
                isAdminAuthentication(authentication)) {

            String username =
                    authentication.getName();

            // =================================================
            // DO NOT PROCESS AUTH ENDPOINTS
            // =================================================

            String path =
                    request.getRequestURI();

            if (!isExcludedPath(path)) {

                boolean valid =
                        adminLoginSessionService
                                .isSessionValid(
                                        username
                                );

                // =============================================
                // SESSION EXPIRED / INVALID
                // =============================================

                if (!valid) {

                    response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                    );

                    response.setContentType(
                            "application/json"
                    );

                    response.getWriter().write(
                            """
                            {
                              "error": "ADMIN_SESSION_EXPIRED",
                              "message": "Your admin session has expired due to inactivity. Please sign in again."
                            }
                            """
                    );

                    return;
                }
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }

    // =========================================================
    // ADMIN AUTHENTICATION CHECK
    // =========================================================

    private boolean isAdminAuthentication(
            Authentication authentication) {

        return authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority -> {

                    String value =
                            authority.getAuthority();

                    return
                            "ROLE_ADMIN".equalsIgnoreCase(
                                    value
                            ) ||

                            "ROLE_SUPER_ADMIN".equalsIgnoreCase(
                                    value
                            ) ||

                            "ROLE_ACCOUNT_MANAGER".equalsIgnoreCase(
                                    value
                            );
                });
    }

    // =========================================================
    // EXCLUDED PATHS
    // =========================================================

    private boolean isExcludedPath(
            String path) {

        if (path == null) {
            return false;
        }

        return
                path.equals(
                        "/api/admin/auth/login"
                ) ||

                path.equals(
                        "/api/admin/auth/logout"
                );
    }
}