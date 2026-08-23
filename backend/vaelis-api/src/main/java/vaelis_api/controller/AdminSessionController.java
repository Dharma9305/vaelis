package vaelis_api.controller;

import vaelis_api.service.AdminLoginSessionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminSessionController {

    private final AdminLoginSessionService
            adminLoginSessionService;

    public AdminSessionController(
            AdminLoginSessionService adminLoginSessionService) {

        this.adminLoginSessionService =
                adminLoginSessionService;
    }

    // =========================================================
    // START / REFRESH ADMIN SESSION
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            Authentication authentication,
            HttpServletRequest request) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "INVALID_CREDENTIALS",

                                    "message",
                                    "Invalid admin credentials."
                            )
                    );
        }

        try {

            String username =
                    authentication.getName();

            String ipAddress =
                    getClientIpAddress(
                            request
                    );

            String userAgent =
                    request.getHeader(
                            "User-Agent"
                    );

            adminLoginSessionService
                    .startOrRefreshSession(
                            username,
                            ipAddress,
                            userAgent
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,

                            "message",
                            "Admin session started.",

                            "username",
                            username
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,

                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "success",
                                    false,

                                    "message",
                                    "Unable to start admin session."
                            )
                    );
        }
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            Authentication authentication,
            @RequestParam(
                    name = "reason",
                    required = false,
                    defaultValue = "USER_LOGOUT"
            )
            String reason) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,

                            "message",
                            "Already logged out."
                    )
            );
        }

        try {

            String username =
                    authentication.getName();

            // =================================================
            // NORMALIZE REASON
            // =================================================

            String normalizedReason =
                    reason == null
                            ? "USER_LOGOUT"
                            : reason.trim().toUpperCase();

            // =================================================
            // ONLY ALLOW KNOWN LOGOUT REASONS
            // =================================================

            if (!"USER_LOGOUT".equals(
                    normalizedReason
            ) &&
                !"IDLE_TIMEOUT".equals(
                    normalizedReason
            )) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,

                                        "message",
                                        "Invalid logout reason."
                                )
                        );
            }

            // =================================================
            // LOGOUT
            // =================================================

            adminLoginSessionService.logout(
                    username,
                    normalizedReason
            );

            // =================================================
            // IDLE TIMEOUT RESPONSE
            // =================================================

            if ("IDLE_TIMEOUT".equals(
                    normalizedReason
            )) {

                return ResponseEntity.ok(
                        Map.of(
                                "success",
                                true,

                                "message",
                                "Admin automatically logged out due to inactivity.",

                                "reason",
                                "IDLE_TIMEOUT"
                        )
                );
            }

            // =================================================
            // NORMAL LOGOUT RESPONSE
            // =================================================

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,

                            "message",
                            "Admin logged out successfully.",

                            "reason",
                            "USER_LOGOUT"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "success",
                                    false,

                                    "message",
                                    "Unable to logout."
                            )
                    );
        }
    }

    // =========================================================
    // CURRENT SESSION
    // =========================================================

    @GetMapping("/session")
    public ResponseEntity<?> currentSession(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            Map.of(
                                    "success",
                                    false,

                                    "message",
                                    "Not authenticated."
                            )
                    );
        }

        try {

            String username =
                    authentication.getName();

            boolean valid =
                    adminLoginSessionService
                            .isSessionValid(
                                    username
                            );

            if (!valid) {

                return ResponseEntity
                        .status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(
                                Map.of(
                                        "success",
                                        false,

                                        "error",
                                        "ADMIN_SESSION_EXPIRED",

                                        "message",
                                        "Admin session expired."
                                )
                        );
            }

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,

                            "username",
                            username,

                            "message",
                            "Admin session is active."
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "success",
                                    false,

                                    "message",
                                    "Unable to check admin session."
                            )
                    );
        }
    }

    // =========================================================
    // CLIENT IP
    // =========================================================

    private String getClientIpAddress(
            HttpServletRequest request) {

        String forwarded =
                request.getHeader(
                        "X-Forwarded-For"
                );

        if (forwarded != null &&
                !forwarded.isBlank()) {

            return forwarded
                    .split(",")[0]
                    .trim();
        }

        String realIp =
                request.getHeader(
                        "X-Real-IP"
                );

        if (realIp != null &&
                !realIp.isBlank()) {

            return realIp;
        }

        return request.getRemoteAddr();
    }
}