package vaelis_api.security;

public final class AdminRoles {

    private AdminRoles() {
        // Utility class.
    }

    // =========================================================
    // SYSTEM ROLES
    // =========================================================

    public static final String SUPER_ADMIN =
            "SUPER_ADMIN";

    public static final String ACCOUNT_MANAGER =
            "ACCOUNT_MANAGER";

    public static final String ADMIN =
            "ADMIN";

    public static final String EMPLOYEE =
            "EMPLOYEE";

    // =========================================================
    // ROLE CHECKS
    // =========================================================

    public static boolean isSuperAdmin(
            String role) {

        return SUPER_ADMIN.equalsIgnoreCase(
                role
        );
    }

    public static boolean isAccountManager(
            String role) {

        return ACCOUNT_MANAGER.equalsIgnoreCase(
                role
        );
    }

    public static boolean isAdmin(
            String role) {

        return ADMIN.equalsIgnoreCase(
                role
        );
    }

    public static boolean isEmployee(
            String role) {

        return EMPLOYEE.equalsIgnoreCase(
                role
        );
    }
}