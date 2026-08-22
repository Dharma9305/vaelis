package vaelis_api.config;

import vaelis_api.entity.AdminPermission;
import vaelis_api.repository.AdminPermissionRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminPermissionInitializer {

    @Bean
    CommandLineRunner initializeAdminPermissions(
            AdminPermissionRepository repository) {

        return args -> {

            // =====================================================
            // DASHBOARD
            // =====================================================

            createIfMissing(
                    repository,
                    "DASHBOARD_VIEW",
                    "View Dashboard",
                    "Allows the admin to view the admin dashboard and its statistics."
            );

            // =====================================================
            // ACCOUNT MANAGEMENT
            // =====================================================

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_VIEW",
                    "View User Accounts",
                    "Allows the authorized account manager to view employee and admin accounts."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_CREATE",
                    "Create User Accounts",
                    "Allows the authorized account manager to create employee and admin accounts."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_UPDATE",
                    "Update User Accounts",
                    "Allows the authorized account manager to update employee and admin account information."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_DISABLE",
                    "Disable User Accounts",
                    "Allows the authorized account manager to disable employee and admin accounts."
            );

            // =====================================================
            // ENABLE USER ACCOUNTS
            // =====================================================

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_ENABLE",
                    "Enable User Accounts",
                    "Allows the authorized account manager to enable approved employee and admin accounts."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_DELETE",
                    "Delete User Accounts",
                    "Allows the authorized account manager to delete employee and admin accounts."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_PASSWORD",
                    "Manage User Passwords",
                    "Allows the authorized account manager to reset or change employee and admin passwords."
            );

            createIfMissing(
                    repository,
                    "ACCOUNT_USERS_PERMISSIONS",
                    "Manage User Permissions",
                    "Allows the authorized account manager to assign or remove permitted permissions from employee and admin accounts."
            );

            // =====================================================
            // PRODUCTS
            // =====================================================

            createIfMissing(
                    repository,
                    "PRODUCTS_VIEW",
                    "View Products",
                    "Allows the admin to view products."
            );

            createIfMissing(
                    repository,
                    "PRODUCTS_MANAGE",
                    "Manage Products",
                    "Allows the admin to create, update and delete products."
            );

            // =====================================================
            // ORDERS
            // =====================================================

            createIfMissing(
                    repository,
                    "ORDERS_VIEW",
                    "View Orders",
                    "Allows the admin to view customer orders."
            );

            createIfMissing(
                    repository,
                    "ORDERS_MANAGE",
                    "Manage Orders",
                    "Allows the admin to update and manage orders."
            );

            // =====================================================
            // INVENTORY
            // =====================================================

            createIfMissing(
                    repository,
                    "INVENTORY_VIEW",
                    "View Inventory",
                    "Allows the admin to view inventory."
            );

            createIfMissing(
                    repository,
                    "INVENTORY_MANAGE",
                    "Manage Inventory",
                    "Allows the admin to update inventory and stock."
            );

            // =====================================================
            // PAYMENTS
            // =====================================================

            createIfMissing(
                    repository,
                    "PAYMENTS_VIEW",
                    "View Payments",
                    "Allows the admin to view payment information."
            );

            createIfMissing(
                    repository,
                    "PAYMENTS_MANAGE",
                    "Manage Payments",
                    "Allows the admin to manage payment-related operations."
            );

            // =====================================================
            // CUSTOMERS
            // =====================================================

            createIfMissing(
                    repository,
                    "CUSTOMERS_VIEW",
                    "View Customers",
                    "Allows the admin to view customers."
            );

            createIfMissing(
                    repository,
                    "CUSTOMERS_MANAGE",
                    "Manage Customers",
                    "Allows the admin to manage customer information."
            );
        };
    }

    // =========================================================
    // CREATE PERMISSION IF IT DOES NOT EXIST
    // =========================================================

    private void createIfMissing(
            AdminPermissionRepository repository,
            String code,
            String name,
            String description) {

        if (!repository.existsByCodeIgnoreCase(code)) {

            repository.save(
                    new AdminPermission(
                            code,
                            name,
                            description
                    )
            );
        }
    }
}