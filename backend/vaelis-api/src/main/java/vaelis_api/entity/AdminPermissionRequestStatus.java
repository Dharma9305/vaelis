package vaelis_api.entity;

/**
 * Status of an administrative permission request.
 *
 * A permission is added to AdminUser.permissions ONLY
 * after final SUPER_ADMIN approval.
 */
public enum AdminPermissionRequestStatus {

    /**
     * Initial state.
     */
    PENDING_ACCOUNT_MANAGER,

    /**
     * Account Manager approved.
     * Final Super Admin approval is required.
     */
    PENDING_SUPER_ADMIN,

    /**
     * Final approval completed.
     * Permission has been activated.
     */
    APPROVED,

    /**
     * Account Manager rejected the request.
     */
    REJECTED_BY_ACCOUNT_MANAGER,

    /**
     * Super Admin rejected the request.
     */
    REJECTED_BY_SUPER_ADMIN
}