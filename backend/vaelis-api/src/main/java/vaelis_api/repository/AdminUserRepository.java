package vaelis_api.repository;

import vaelis_api.entity.AdminUser;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminUserRepository
        extends JpaRepository<AdminUser, Long> {

    // =========================================================
    // FIND ACTIVE USER BY USERNAME
    // =========================================================

    Optional<AdminUser> findByUsernameIgnoreCaseAndDeletedFalse(
            String username
    );

    // =========================================================
    // FIND USER BY USERNAME
    // =========================================================
    //
    // Used for duplicate checks and administrative operations.
    // Includes deleted accounts.
    // =========================================================

    Optional<AdminUser> findByUsernameIgnoreCase(
            String username
    );

    // =========================================================
    // FIND BY EMAIL
    // =========================================================

    Optional<AdminUser> findByEmailIgnoreCase(
            String email
    );

    // =========================================================
    // PENDING ADMIN ACCOUNTS
    // =========================================================

    List<AdminUser> findByRoleIgnoreCaseAndApprovedFalseAndDeletedFalse(
            String role
    );

    // =========================================================
    // APPROVED ADMIN ACCOUNTS
    // =========================================================

    List<AdminUser> findByRoleIgnoreCaseAndApprovedTrueAndDeletedFalse(
            String role
    );

    // =========================================================
    // PENDING ACCOUNT MANAGERS
    // =========================================================

    List<AdminUser>
    findByRoleIgnoreCaseAndApprovedFalseAndDeletedFalseOrderByCreatedAtDesc(
            String role
    );

    // =========================================================
    // APPROVED ACCOUNT MANAGERS
    // =========================================================

    List<AdminUser>
    findByRoleIgnoreCaseAndApprovedTrueAndDeletedFalseOrderByCreatedAtDesc(
            String role
    );
    // =========================================================
// DELETED USERS BY ROLE
// =========================================================

List<AdminUser>
findByRoleIgnoreCaseAndDeletedTrueOrderByUpdatedAtDesc(
        String role
);

    // =========================================================
    // DELETED USERS
    // =========================================================

    List<AdminUser>
    findByDeletedTrueOrderByUpdatedAtDesc();

    // =========================================================
    // ACTIVE USERS
    // =========================================================

    List<AdminUser>
    findByDeletedFalseOrderByCreatedAtDesc();
}