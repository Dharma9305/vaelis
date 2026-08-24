package vaelis_api.service;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminPermissionRepository;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AdminPermissionService {

    private final AdminUserRepository adminUserRepository;

    private final AdminPermissionRepository
            adminPermissionRepository;

    public AdminPermissionService(
            AdminUserRepository adminUserRepository,
            AdminPermissionRepository adminPermissionRepository) {

        this.adminUserRepository =
                adminUserRepository;

        this.adminPermissionRepository =
                adminPermissionRepository;
    }

    // =========================================================
    // GET ALL PERMISSIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminPermission> getAllPermissions() {

        return adminPermissionRepository.findAll();
    }

    // =========================================================
    // GET USER PERMISSIONS
    // =========================================================

    @Transactional(readOnly = true)
    public Set<AdminPermission> getAdminPermissions(
            Long adminUserId) {

        AdminUser adminUser =
                findAdmin(adminUserId);

        return new HashSet<>(
                adminUser.getPermissions()
        );
    }

    // =========================================================
    // ASSIGN / REPLACE ALL PERMISSIONS
    // =========================================================

    @Transactional
    public AdminUser assignPermissions(
            Long adminUserId,
            Set<Long> permissionIds) {

        AdminUser adminUser =
                findAdmin(adminUserId);

        validatePermissionManageableAccount(
                adminUser
        );

        Set<AdminPermission> permissions =
                new HashSet<>();

        if (permissionIds != null &&
                !permissionIds.isEmpty()) {

            for (Long permissionId : permissionIds) {

                AdminPermission permission =
                        adminPermissionRepository
                                .findById(permissionId)
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Permission not found: "
                                                        + permissionId
                                        )
                                );

                // =================================================
                // PERMISSION MUST BE ENABLED
                // =================================================

                if (!permission.isEnabled()) {

                    throw new IllegalStateException(
                            "Permission is disabled: "
                                    + permission.getCode()
                    );
                }

                // =================================================
                // ROLE SECURITY BOUNDARY
                // =================================================

                validatePermissionForRole(
                        adminUser,
                        permission
                );

                permissions.add(
                        permission
                );
            }
        }

        adminUser.setPermissions(
                permissions
        );

        return adminUserRepository.save(
                adminUser
        );
    }

    // =========================================================
    // ADD SINGLE PERMISSION
    // =========================================================

    @Transactional
    public AdminUser addPermission(
            Long adminUserId,
            Long permissionId) {

        AdminUser adminUser =
                findAdmin(adminUserId);

        validatePermissionManageableAccount(
                adminUser
        );

        AdminPermission permission =
                adminPermissionRepository
                        .findById(permissionId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Permission not found."
                                )
                        );

        // =====================================================
        // PERMISSION MUST BE ENABLED
        // =====================================================

        if (!permission.isEnabled()) {

            throw new IllegalStateException(
                    "Permission is disabled."
            );
        }

        // =====================================================
        // ROLE SECURITY BOUNDARY
        // =====================================================

        validatePermissionForRole(
                adminUser,
                permission
        );

        adminUser
                .getPermissions()
                .add(permission);

        return adminUserRepository.save(
                adminUser
        );
    }

    // =========================================================
    // REMOVE SINGLE PERMISSION
    // =========================================================

    @Transactional
    public AdminUser removePermission(
            Long adminUserId,
            Long permissionId) {

        AdminUser adminUser =
                findAdmin(adminUserId);

        validatePermissionManageableAccount(
                adminUser
        );

        adminUser
                .getPermissions()
                .removeIf(
                        permission ->
                                permission
                                        .getId()
                                        .equals(permissionId)
                );

        return adminUserRepository.save(
                adminUser
        );
    }

    // =========================================================
    // FIND USER
    // =========================================================

    private AdminUser findAdmin(
            Long adminUserId) {

        return adminUserRepository
                .findById(adminUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Admin account not found."
                        )
                );
    }

    // =========================================================
    // VALIDATE PERMISSION-MANAGEABLE ACCOUNT
    // =========================================================

    private void validatePermissionManageableAccount(
            AdminUser adminUser) {

        if (adminUser == null) {

            throw new IllegalArgumentException(
                    "Admin account not found."
            );
        }

        String role =
                adminUser.getRole();

        // =====================================================
        // ADMIN
        // =====================================================

        if ("ADMIN".equalsIgnoreCase(role)) {

            return;
        }

        // =====================================================
        // ACCOUNT MANAGER
        // =====================================================

        if ("ACCOUNT_MANAGER".equalsIgnoreCase(role)) {

            return;
        }

        // =====================================================
        // OTHER ROLES
        // =====================================================

        throw new IllegalStateException(
                "Permissions can only be assigned to "
                        + "ADMIN or ACCOUNT_MANAGER accounts."
        );
    }

    // =========================================================
    // VALIDATE PERMISSION FOR ROLE
    // =========================================================
    //
    // ACCOUNT_MANAGER can receive only explicitly approved
    // permission families.
    //
    // ALLOWED:
    //
    // ACCOUNT_USERS_*
    // EMPLOYEE_RECORDS_*
    // EMPLOYEE_ADDRESS_*
    // EMPLOYEE_EMERGENCY_CONTACT_*
    // EMPLOYEE_DOCUMENT_*
    // EMPLOYEE_EMPLOYMENT_HISTORY_*
    // EMPLOYEE_EDUCATION_*
    // EMPLOYEE_SKILL_*
    //
    // EVERYTHING ELSE IS DENIED.
    //
    // =========================================================

    private void validatePermissionForRole(
            AdminUser adminUser,
            AdminPermission permission) {

        // =====================================================
        // ONLY APPLY THIS RESTRICTION TO ACCOUNT_MANAGER
        // =====================================================

        if (!"ACCOUNT_MANAGER".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            return;
        }

        // =====================================================
        // VALIDATE PERMISSION OBJECT
        // =====================================================

        if (permission == null) {

            throw new IllegalStateException(
                    "Permission is required."
            );
        }

        String permissionCode =
                permission.getCode();

        if (permissionCode == null ||
                permissionCode.isBlank()) {

            throw new IllegalStateException(
                    "Permission code is required."
            );
        }

        // =====================================================
        // NORMALIZE
        // =====================================================

        String normalizedCode =
                permissionCode
                        .trim()
                        .toUpperCase();

        // =====================================================
        // ACCOUNT USER PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "ACCOUNT_USERS_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE RECORD PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_RECORDS_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE ADDRESS PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_ADDRESS_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE EMERGENCY CONTACT PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_EMERGENCY_CONTACT_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE DOCUMENT PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_DOCUMENT_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE EMPLOYMENT HISTORY PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_EMPLOYMENT_HISTORY_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE EDUCATION PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_EDUCATION_"
        )) {

            return;
        }

        // =====================================================
        // EMPLOYEE SKILL PERMISSIONS
        // =====================================================

        if (normalizedCode.startsWith(
                "EMPLOYEE_SKILL_"
        )) {

            return;
        }

        // =====================================================
        // DENY EVERYTHING ELSE
        // =====================================================

        throw new IllegalStateException(
                "ACCOUNT_MANAGER cannot receive permission: "
                        + permissionCode
        );
    }
}