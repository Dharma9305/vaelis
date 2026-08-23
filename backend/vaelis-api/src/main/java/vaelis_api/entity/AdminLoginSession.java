package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "admin_login_sessions",
        indexes = {
                @Index(
                        name = "idx_admin_session_username",
                        columnList = "username"
                ),
                @Index(
                        name = "idx_admin_session_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_admin_session_last_activity",
                        columnList = "last_activity_at"
                )
        }
)
public class AdminLoginSession {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // ADMIN USER
    // =========================================================

    @Column(
            nullable = false,
            length = 100
    )
    private String username;

    @Column(
            nullable = false,
            length = 30
    )
    private String role;

    @Column(
            nullable = false
    )
    private Long adminUserId;

    // =========================================================
    // LOGIN
    // =========================================================

    @Column(
            nullable = false
    )
    private LocalDateTime loginAt;

    // =========================================================
    // LAST ACTIVITY
    // =========================================================

    @Column(
            nullable = false
    )
    private LocalDateTime lastActivityAt;

    // =========================================================
    // LOGOUT
    // =========================================================

    @Column
    private LocalDateTime logoutAt;

    // =========================================================
    // SESSION DURATION
    // =========================================================

    @Column
    private Long sessionDurationSeconds;

    // =========================================================
    // STATUS
    // =========================================================

    @Column(
            nullable = false,
            length = 30
    )
    private String status;

    // =========================================================
    // LOGOUT REASON
    // =========================================================

    @Column(
            length = 50
    )
    private String logoutReason;

    // =========================================================
    // IP ADDRESS
    // =========================================================

    @Column(
            length = 100
    )
    private String ipAddress;

    // =========================================================
    // USER AGENT
    // =========================================================

    @Column(
            length = 1000
    )
    private String userAgent;

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public AdminLoginSession() {
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getAdminUserId() {
        return adminUserId;
    }

    public void setAdminUserId(Long adminUserId) {
        this.adminUserId = adminUserId;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }

    public void setLoginAt(LocalDateTime loginAt) {
        this.loginAt = loginAt;
    }

    public LocalDateTime getLastActivityAt() {
        return lastActivityAt;
    }

    public void setLastActivityAt(LocalDateTime lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }

    public LocalDateTime getLogoutAt() {
        return logoutAt;
    }

    public void setLogoutAt(LocalDateTime logoutAt) {
        this.logoutAt = logoutAt;
    }

    public Long getSessionDurationSeconds() {
        return sessionDurationSeconds;
    }

    public void setSessionDurationSeconds(
            Long sessionDurationSeconds) {

        this.sessionDurationSeconds =
                sessionDurationSeconds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLogoutReason() {
        return logoutReason;
    }

    public void setLogoutReason(String logoutReason) {
        this.logoutReason = logoutReason;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}