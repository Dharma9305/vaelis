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

    public AdminApprovalService(
            AdminUserRepository adminUserRepository) {

        this.adminUserRepository =
                adminUserRepository;
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

        return adminUserRepository.save(
                adminUser
        );
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

        return adminUserRepository.save(
                adminUser
        );
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

        return adminUserRepository.save(
                adminUser
        );
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

        return adminUserRepository.save(
                adminUser
        );
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

        return adminUserRepository.save(
                accountManager
        );
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

        return adminUserRepository.save(
                accountManager
        );
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

        return adminUserRepository.save(
                accountManager
        );
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

        return adminUserRepository.save(
                accountManager
        );
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

        return adminUserRepository.save(
                employee
        );
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

        return adminUserRepository.save(
                employee
        );
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

        return adminUserRepository.save(
                employee
        );
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

        return adminUserRepository.save(
                employee
        );
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