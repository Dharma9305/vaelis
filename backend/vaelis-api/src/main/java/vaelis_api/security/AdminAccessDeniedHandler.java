package vaelis_api.security;

import vaelis_api.service.AdminActivityLogService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class AdminAccessDeniedHandler
        implements AccessDeniedHandler {

    private final AdminActivityLogService
            adminActivityLogService;

    public AdminAccessDeniedHandler(
            AdminActivityLogService adminActivityLogService) {

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // ACCESS DENIED
    // =========================================================

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String actorUsername =
                authentication != null &&
                        authentication.isAuthenticated()
                        ? authentication.getName()
                        : "UNKNOWN";

        String requestUri =
                request.getRequestURI();

        String requestMethod =
                request.getMethod();

        // =====================================================
        // EMPLOYEE RECORD ACCESS DENIED
        // =====================================================

        if (requestUri.startsWith(
                "/api/admin/employees")) {

            adminActivityLogService.log(
                    "EMPLOYEE_RECORD_ACCESS_DENIED",
                    null,
                    null,
                    "EMPLOYEE",
                    "Employee record access denied. "
                            + "Request: "
                            + requestMethod
                            + " "
                            + requestUri
                            + ". Actor: "
                            + actorUsername
                            + ". Required permission: "
                            + "EMPLOYEE_RECORDS_VIEW.",
                    "DENIED"
            );
        }

        // =====================================================
        // STANDARD 403 RESPONSE
        // =====================================================

        response.setStatus(
                HttpServletResponse.SC_FORBIDDEN
        );

        response.setContentType(
                "application/json"
        );

        response.setCharacterEncoding(
                "UTF-8"
        );

        String json =
                "{"
                        + "\"timestamp\":\""
                        + LocalDateTime.now()
                        + "\","
                        + "\"status\":403,"
                        + "\"error\":\"Forbidden\","
                        + "\"message\":\"You do not have permission to access this resource.\","
                        + "\"path\":\""
                        + escapeJson(requestUri)
                        + "\""
                        + "}";

        response.getWriter().write(
                json
        );
    }

    // =========================================================
    // JSON ESCAPE
    // =========================================================

    private String escapeJson(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace(
                        "\\",
                        "\\\\"
                )
                .replace(
                        "\"",
                        "\\\""
                );
    }
}