package vaelis_api.entity;

/**
 * Status of an administrative permission request.
 *
 * Permission is NOT added to AdminUser.permissions
 * until the request reaches APPROVED.
 */
public enum AdminPermissionRequestStatus {

    /**
     * Request created by ADMIN / EMPLOYEE /
     * ACCOUNT_MANAGER and waiting for Account Manager review.
     */
    PENDING_ACCOUNT_MANAGER,

    /**
     * Account Manager approved.
     * Waiting for Super Admin final approval.
     */
    PENDING_SUPER_ADMIN,

    /**
     * Final approval by Super Admin.
     *
     * Permission can now be activated.
     */
    APPROVED,

    /**
     * Rejected by Account Manager.
     */
    REJECTED_BY_ACCOUNT_MANAGER,

    /**
     * Rejected by Super Admin.
     */
    REJECTED_BY_SUPER_ADMIN
}