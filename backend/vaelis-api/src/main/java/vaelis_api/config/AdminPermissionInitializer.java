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
        "EMPLOYEE_RECORDS_VIEW",
        "View Employee Records",
        "Allows authorized personnel to view corporate employee records and employee profile information."
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
// EMPLOYEE RECORDS
// =====================================================
createIfMissing(
        repository,
        "EMPLOYEE_RECORDS_UPDATE",
        "Update Employee Records",
        "Allows authorized personnel to update corporate employee records."
);
createIfMissing(
        repository,
        "EMPLOYEE_RECORDS_CREATE",
        "Create Employee Records",
        "Allows authorized personnel to create corporate employee records."
);
createIfMissing(
        repository,
        "EMPLOYEE_RECORDS_VIEW",
        "View Employee Records",
        "Allows authorized personnel to view employee corporate records."
);
// =====================================================
// EMPLOYEE ADDRESSES
// =====================================================

createIfMissing(
        repository,
        "EMPLOYEE_ADDRESS_VIEW",
        "View Employee Addresses",
        "Allows authorized personnel to view employee addresses."
);

createIfMissing(
        repository,
        "EMPLOYEE_ADDRESS_CREATE",
        "Create Employee Addresses",
        "Allows authorized personnel to create employee addresses."
);

createIfMissing(
        repository,
        "EMPLOYEE_ADDRESS_UPDATE",
        "Update Employee Addresses",
        "Allows authorized personnel to update employee addresses."
);

createIfMissing(
        repository,
        "EMPLOYEE_ADDRESS_DELETE",
        "Delete Employee Addresses",
        "Allows authorized personnel to delete employee addresses."
);
// =====================================================
// EMPLOYEE DOCUMENTS
// =====================================================

createIfMissing(
        repository,
        "EMPLOYEE_DOCUMENT_VIEW",
        "View Employee Documents",
        "Allows authorized personnel to view employee documents."
);

createIfMissing(
        repository,
        "EMPLOYEE_DOCUMENT_CREATE",
        "Create Employee Documents",
        "Allows authorized personnel to create employee documents."
);

createIfMissing(
        repository,
        "EMPLOYEE_DOCUMENT_UPDATE",
        "Update Employee Documents",
        "Allows authorized personnel to update employee documents."
);

createIfMissing(
        repository,
        "EMPLOYEE_DOCUMENT_DELETE",
        "Delete Employee Documents",
        "Allows authorized personnel to delete employee documents."
);
// =====================================================
// EMPLOYEE EMPLOYMENT HISTORY
// =====================================================

createIfMissing(
        repository,
        "EMPLOYEE_EMPLOYMENT_HISTORY_VIEW",
        "View Employee Employment History",
        "Allows authorized personnel to view an employee's previous employment history."
);

createIfMissing(
        repository,
        "EMPLOYEE_EMPLOYMENT_HISTORY_CREATE",
        "Create Employee Employment History",
        "Allows authorized personnel to add previous employment history for an employee."
);

createIfMissing(
        repository,
        "EMPLOYEE_EMPLOYMENT_HISTORY_UPDATE",
        "Update Employee Employment History",
        "Allows authorized personnel to update an employee's previous employment history."
);

createIfMissing(
        repository,
        "EMPLOYEE_EMPLOYMENT_HISTORY_DELETE",
        "Delete Employee Employment History",
        "Allows authorized personnel to delete an employee's previous employment history."
);
// =====================================================
// EMPLOYEE EDUCATION
// =====================================================

createIfMissing(
        repository,
        "EMPLOYEE_EDUCATION_VIEW",
        "View Employee Education",
        "Allows authorized personnel to view employee education and qualification records."
);

createIfMissing(
        repository,
        "EMPLOYEE_EDUCATION_CREATE",
        "Create Employee Education",
        "Allows authorized personnel to create employee education and qualification records."
);

createIfMissing(
        repository,
        "EMPLOYEE_EDUCATION_UPDATE",
        "Update Employee Education",
        "Allows authorized personnel to update employee education and qualification records."
);

createIfMissing(
        repository,
        "EMPLOYEE_EDUCATION_DELETE",
        "Delete Employee Education",
        "Allows authorized personnel to delete employee education and qualification records."
);
// =====================================================
// EMPLOYEE SKILLS
// =====================================================

createIfMissing(
        repository,
        "EMPLOYEE_SKILL_VIEW",
        "View Employee Skills",
        "Allows authorized personnel to view employee skills and competencies."
);

createIfMissing(
        repository,
        "EMPLOYEE_SKILL_CREATE",
        "Create Employee Skills",
        "Allows authorized personnel to create employee skills and competencies."
);

createIfMissing(
        repository,
        "EMPLOYEE_SKILL_UPDATE",
        "Update Employee Skills",
        "Allows authorized personnel to update employee skills and competencies."
);

createIfMissing(
        repository,
        "EMPLOYEE_SKILL_DELETE",
        "Delete Employee Skills",
        "Allows authorized personnel to delete employee skills and competencies."
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