package vaelis_api.service;

import vaelis_api.entity.AdminUser;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class EmployeeMeService {

    private final AdminUserRepository adminUserRepository;

    private final EmployeeRecordRepository employeeRecordRepository;

    public EmployeeMeService(
            AdminUserRepository adminUserRepository,
            EmployeeRecordRepository employeeRecordRepository) {

        this.adminUserRepository =
                adminUserRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;
    }

    // =========================================================
    // CURRENT EMPLOYEE
    // =========================================================

    public EmployeeRecord getCurrentEmployee(
            Authentication authentication) {

        // =====================================================
        // AUTHENTICATION CHECK
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalStateException(
                    "Employee is not authenticated."
            );
        }

        // =====================================================
        // ROLE CHECK
        // =====================================================

        boolean employee =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                "ROLE_EMPLOYEE"
                                        .equalsIgnoreCase(
                                                authority.getAuthority()
                                        )
                        );

        if (!employee) {

            throw new IllegalStateException(
                    "Authenticated user is not an employee."
            );
        }

        // =====================================================
        // USERNAME
        // =====================================================

        String username =
                authentication.getName();

        if (username == null ||
                username.isBlank()) {

            throw new IllegalStateException(
                    "Employee username is missing."
            );
        }

        // =====================================================
        // FIND ADMIN USER
        //
        // Employee accounts currently use AdminUser
        // authentication infrastructure.
        // =====================================================

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCase(
                                username.trim()
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Employee account was not found."
                                )
                        );

        // =====================================================
        // ACCOUNT VALIDATION
        // =====================================================

        if (adminUser.isDeleted()) {

            throw new IllegalStateException(
                    "Employee account has been deleted."
            );
        }

        if (!adminUser.isEnabled()) {

            throw new IllegalStateException(
                    "Employee account is disabled."
            );
        }

        if (!"EMPLOYEE".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            throw new IllegalStateException(
                    "Authenticated account is not an employee."
            );
        }

        // =====================================================
        // FIND LINKED EMPLOYEE RECORD
        // =====================================================

        return employeeRecordRepository
                .findByAdminUserId(
                        adminUser.getId()
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No employee profile is linked to this account."
                        )
                );
    }
}