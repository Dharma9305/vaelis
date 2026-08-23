package vaelis_api.service;

import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminApprovalService {

    private final AdminUserRepository adminUserRepository;

    private final AdminActivityLogService adminActivityLogService;

    public AdminApprovalService(
            AdminUserRepository adminUserRepository,
            AdminActivityLogService adminActivityLogService) {

        this.adminUserRepository =
                adminUserRepository;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // PENDING ADMIN ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getPendingAdmins() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedFalseAndDeletedFalse(
                        "ADMIN"
                );
    }

    // =========================================================
    // APPROVED ADMIN ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getApprovedAdmins() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedTrueAndDeletedFalse(
                        "ADMIN"
                );
    }

    // =========================================================
    // APPROVE ADMIN
    // =========================================================

    @Transactional
    public AdminUser approveAdmin(
            Long adminUserId,
            String approvedBy) {

        verifySuperAdminApprover(approvedBy);

        AdminUser adminUser =
                findAccount(
                        adminUserId,
                        "Admin account not found."
                );

        validateNotDeleted(adminUser);

        validateRole(
                adminUser,
                "ADMIN",
                "Only ADMIN accounts can be approved."
        );

        approve(
                adminUser,
                approvedBy
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        adminUser
                );

        adminActivityLogService.log(
                "APPROVE_ADMIN",
                savedUser,
                "ADMIN account approved and enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // REJECT ADMIN
    // =========================================================

    @Transactional
    public AdminUser rejectAdmin(
            Long adminUserId) {

        AdminUser adminUser =
                findAccount(
                        adminUserId,
                        "Admin account not found."
                );

        validateNotDeleted(adminUser);

        validateRole(
                adminUser,
                "ADMIN",
                "Only ADMIN accounts can be rejected."
        );

        reject(adminUser);

        AdminUser savedUser =
                adminUserRepository.save(
                        adminUser
                );

        adminActivityLogService.log(
                "REJECT_ADMIN",
                savedUser,
                "ADMIN account approval rejected.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // DISABLE ADMIN
    // =========================================================

    @Transactional
    public AdminUser disableAdmin(
            Long adminUserId) {

        AdminUser adminUser =
                findAccount(
                        adminUserId,
                        "Admin account not found."
                );

        validateNotDeleted(adminUser);

        validateRole(
                adminUser,
                "ADMIN",
                "Only ADMIN accounts can be disabled."
        );

        adminUser.setEnabled(false);

        AdminUser savedUser =
                adminUserRepository.save(
                        adminUser
                );

        adminActivityLogService.log(
                "DISABLE_ADMIN",
                savedUser,
                "ADMIN account disabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // ENABLE ADMIN
    // =========================================================

    @Transactional
    public AdminUser enableAdmin(
            Long adminUserId) {

        AdminUser adminUser =
                findAccount(
                        adminUserId,
                        "Admin account not found."
                );

        validateNotDeleted(adminUser);

        validateRole(
                adminUser,
                "ADMIN",
                "Only ADMIN accounts can be enabled."
        );

        ensureApproved(adminUser);

        adminUser.setEnabled(true);

        AdminUser savedUser =
                adminUserRepository.save(
                        adminUser
                );

        adminActivityLogService.log(
                "ENABLE_ADMIN",
                savedUser,
                "ADMIN account enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // PENDING ACCOUNT MANAGERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getPendingAccountManagers() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedFalseAndDeletedFalseOrderByCreatedAtDesc(
                        "ACCOUNT_MANAGER"
                );
    }

    // =========================================================
    // APPROVED ACCOUNT MANAGERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getApprovedAccountManagers() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedTrueAndDeletedFalseOrderByCreatedAtDesc(
                        "ACCOUNT_MANAGER"
                );
    }

    // =========================================================
    // APPROVE ACCOUNT MANAGER
    // =========================================================

    @Transactional
    public AdminUser approveAccountManager(
            Long accountManagerId,
            String approvedBy) {

        verifySuperAdminApprover(approvedBy);

        AdminUser accountManager =
                findAccount(
                        accountManagerId,
                        "Account Manager account not found."
                );

        validateNotDeleted(accountManager);

        validateRole(
                accountManager,
                "ACCOUNT_MANAGER",
                "Only ACCOUNT_MANAGER accounts can be approved."
        );

        approve(
                accountManager,
                approvedBy
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        accountManager
                );

        adminActivityLogService.log(
                "APPROVE_ACCOUNT_MANAGER",
                savedUser,
                "ACCOUNT_MANAGER account approved and enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // REJECT ACCOUNT MANAGER
    // =========================================================

    @Transactional
    public AdminUser rejectAccountManager(
            Long accountManagerId) {

        AdminUser accountManager =
                findAccount(
                        accountManagerId,
                        "Account Manager account not found."
                );

        validateNotDeleted(accountManager);

        validateRole(
                accountManager,
                "ACCOUNT_MANAGER",
                "Only ACCOUNT_MANAGER accounts can be rejected."
        );

        reject(accountManager);

        AdminUser savedUser =
                adminUserRepository.save(
                        accountManager
                );

        adminActivityLogService.log(
                "REJECT_ACCOUNT_MANAGER",
                savedUser,
                "ACCOUNT_MANAGER approval rejected.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // DISABLE ACCOUNT MANAGER
    // =========================================================

    @Transactional
    public AdminUser disableAccountManager(
            Long accountManagerId) {

        AdminUser accountManager =
                findAccount(
                        accountManagerId,
                        "Account Manager account not found."
                );

        validateNotDeleted(accountManager);

        validateRole(
                accountManager,
                "ACCOUNT_MANAGER",
                "Only ACCOUNT_MANAGER accounts can be disabled."
        );

        accountManager.setEnabled(false);

        AdminUser savedUser =
                adminUserRepository.save(
                        accountManager
                );

        adminActivityLogService.log(
                "DISABLE_ACCOUNT_MANAGER",
                savedUser,
                "ACCOUNT_MANAGER account disabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // ENABLE ACCOUNT MANAGER
    // =========================================================

    @Transactional
    public AdminUser enableAccountManager(
            Long accountManagerId) {

        AdminUser accountManager =
                findAccount(
                        accountManagerId,
                        "Account Manager account not found."
                );

        validateNotDeleted(accountManager);

        validateRole(
                accountManager,
                "ACCOUNT_MANAGER",
                "Only ACCOUNT_MANAGER accounts can be enabled."
        );

        ensureApproved(accountManager);

        accountManager.setEnabled(true);

        AdminUser savedUser =
                adminUserRepository.save(
                        accountManager
                );

        adminActivityLogService.log(
                "ENABLE_ACCOUNT_MANAGER",
                savedUser,
                "ACCOUNT_MANAGER account enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // PENDING EMPLOYEE ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getPendingEmployees() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedFalseAndDeletedFalseOrderByCreatedAtDesc(
                        "EMPLOYEE"
                );
    }

    // =========================================================
    // APPROVED EMPLOYEE ACCOUNTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getApprovedEmployees() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndApprovedTrueAndDeletedFalseOrderByCreatedAtDesc(
                        "EMPLOYEE"
                );
    }

    // =========================================================
    // APPROVE EMPLOYEE
    // =========================================================

    @Transactional
    public AdminUser approveEmployee(
            Long employeeId,
            String approvedBy) {

        verifySuperAdminApprover(approvedBy);

        AdminUser employee =
                findAccount(
                        employeeId,
                        "Employee account not found."
                );

        validateNotDeleted(employee);

        validateRole(
                employee,
                "EMPLOYEE",
                "Only EMPLOYEE accounts can be approved."
        );

        approve(
                employee,
                approvedBy
        );

        AdminUser savedUser =
                adminUserRepository.save(
                        employee
                );

        adminActivityLogService.log(
                "APPROVE_EMPLOYEE",
                savedUser,
                "EMPLOYEE account approved and enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // REJECT EMPLOYEE
    // =========================================================

    @Transactional
    public AdminUser rejectEmployee(
            Long employeeId) {

        AdminUser employee =
                findAccount(
                        employeeId,
                        "Employee account not found."
                );

        validateNotDeleted(employee);

        validateRole(
                employee,
                "EMPLOYEE",
                "Only EMPLOYEE accounts can be rejected."
        );

        reject(employee);

        AdminUser savedUser =
                adminUserRepository.save(
                        employee
                );

        adminActivityLogService.log(
                "REJECT_EMPLOYEE",
                savedUser,
                "EMPLOYEE approval rejected.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // DISABLE EMPLOYEE
    // =========================================================

    @Transactional
    public AdminUser disableEmployee(
            Long employeeId) {

        AdminUser employee =
                findAccount(
                        employeeId,
                        "Employee account not found."
                );

        validateNotDeleted(employee);

        validateRole(
                employee,
                "EMPLOYEE",
                "Only EMPLOYEE accounts can be disabled."
        );

        employee.setEnabled(false);

        AdminUser savedUser =
                adminUserRepository.save(
                        employee
                );

        adminActivityLogService.log(
                "DISABLE_EMPLOYEE",
                savedUser,
                "EMPLOYEE account disabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // ENABLE EMPLOYEE
    // =========================================================

    @Transactional
    public AdminUser enableEmployee(
            Long employeeId) {

        AdminUser employee =
                findAccount(
                        employeeId,
                        "Employee account not found."
                );

        validateNotDeleted(employee);

        validateRole(
                employee,
                "EMPLOYEE",
                "Only EMPLOYEE accounts can be enabled."
        );

        ensureApproved(employee);

        employee.setEnabled(true);

        AdminUser savedUser =
                adminUserRepository.save(
                        employee
                );

        adminActivityLogService.log(
                "ENABLE_EMPLOYEE",
                savedUser,
                "EMPLOYEE account enabled by Super Admin.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // DELETED USERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getDeletedUsers() {

        return adminUserRepository
                .findByDeletedTrueOrderByUpdatedAtDesc();
    }

    // =========================================================
    // DELETED EMPLOYEES
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getDeletedEmployees() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndDeletedTrueOrderByUpdatedAtDesc(
                        "EMPLOYEE"
                );
    }

    // =========================================================
    // DELETED ADMINS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getDeletedAdmins() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndDeletedTrueOrderByUpdatedAtDesc(
                        "ADMIN"
                );
    }

    // =========================================================
    // DELETED ACCOUNT MANAGERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUser> getDeletedAccountManagers() {

        return adminUserRepository
                .findByRoleIgnoreCaseAndDeletedTrueOrderByUpdatedAtDesc(
                        "ACCOUNT_MANAGER"
                );
    }

    // =========================================================
    // RESTORE DELETED USER
    // =========================================================

    @Transactional
    public AdminUser restoreDeletedUser(
            Long userId) {

        AdminUser user =
                findAccount(
                        userId,
                        "User account not found."
                );

        if (!user.isDeleted()) {

            throw new IllegalStateException(
                    "User account is not deleted."
            );
        }

        if ("SUPER_ADMIN".equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    "SUPER_ADMIN accounts cannot be restored through deleted-user management."
            );
        }

        user.setDeleted(false);

        // Restored accounts remain disabled.
        user.setEnabled(false);

        AdminUser savedUser =
                adminUserRepository.save(
                        user
                );

        adminActivityLogService.log(
                "RESTORE_USER",
                savedUser,
                "Deleted user account restored. Account remains disabled pending explicit enablement.",
                "SUCCESS"
        );

        return savedUser;
    }

    // =========================================================
    // COMMON: FIND ACCOUNT
    // =========================================================

    private AdminUser findAccount(
            Long id,
            String message) {

        return adminUserRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                message
                        )
                );
    }

    // =========================================================
    // COMMON: DELETED CHECK
    // =========================================================

    private void validateNotDeleted(
            AdminUser user) {

        if (user.isDeleted()) {

            throw new IllegalStateException(
                    "User account has been deleted."
            );
        }
    }

    // =========================================================
    // COMMON: ROLE VALIDATION
    // =========================================================

    private void validateRole(
            AdminUser user,
            String expectedRole,
            String message) {

        if (!expectedRole.equalsIgnoreCase(
                user.getRole()
        )) {

            throw new IllegalStateException(
                    message
            );
        }
    }

    // =========================================================
    // COMMON: APPROVE
    // =========================================================

    private void approve(
            AdminUser user,
            String approvedBy) {

        user.setApproved(true);

        user.setApprovedBy(
                approvedBy
        );

        user.setApprovedAt(
                LocalDateTime.now()
        );

        user.setEnabled(true);
    }

    // =========================================================
    // COMMON: REJECT
    // =========================================================

    private void reject(
            AdminUser user) {

        user.setApproved(false);
        user.setEnabled(false);
    }

    // =========================================================
    // COMMON: APPROVED CHECK
    // =========================================================

    private void ensureApproved(
            AdminUser user) {

        if (!user.isApproved()) {

            throw new IllegalStateException(
                    "Account must be approved before it can be enabled."
            );
        }
    }

    // =========================================================
    // SUPER ADMIN APPROVER VERIFICATION
    // =========================================================

    private void verifySuperAdminApprover(
            String approvedBy) {

        if (approvedBy == null ||
                approvedBy.isBlank()) {

            throw new IllegalStateException(
                    "Super Admin identity is required for approval."
            );
        }

        AdminUser approver =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                approvedBy.trim()
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Approving Super Admin account not found."
                                )
                        );

        if (!"SUPER_ADMIN".equalsIgnoreCase(
                approver.getRole()
        )) {

            throw new IllegalStateException(
                    "Only SUPER_ADMIN can approve accounts."
            );
        }

        if (!approver.isApproved()) {

            throw new IllegalStateException(
                    "Approving Super Admin account is not approved."
            );
        }

        if (!approver.isEnabled()) {

            throw new IllegalStateException(
                    "Approving Super Admin account is disabled."
            );
        }
    }
}