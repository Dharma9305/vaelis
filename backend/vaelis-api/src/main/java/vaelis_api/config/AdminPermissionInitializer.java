package vaelis_api.config;

import vaelis_api.entity.AdminModule;
import vaelis_api.entity.AdminPermission;
import vaelis_api.repository.AdminModuleRepository;
import vaelis_api.repository.AdminPermissionRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminPermissionInitializer {

    @Bean
    CommandLineRunner initializeAdminPermissions(
            AdminModuleRepository moduleRepository,
            AdminPermissionRepository permissionRepository) {

        return args -> {

            // =====================================================
            // MODULES
            // =====================================================

            AdminModule products =
                    createModuleIfMissing(
                            moduleRepository,
                            "PRODUCTS",
                            "Products",
                            "Product catalog, product administration and product operations."
                    );

            AdminModule employees =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEES",
                            "Employees",
                            "Employee workforce assignment, availability and operational coverage."
                    );

            AdminModule orders =
                    createModuleIfMissing(
                            moduleRepository,
                            "ORDERS",
                            "Orders",
                            "Customer orders and order management."
                    );

            AdminModule inventory =
                    createModuleIfMissing(
                            moduleRepository,
                            "INVENTORY",
                            "Inventory",
                            "Inventory, stock and inventory operations."
                    );

            AdminModule payments =
                    createModuleIfMissing(
                            moduleRepository,
                            "PAYMENTS",
                            "Payments",
                            "Payment information and payment-related operations."
                    );

            AdminModule customers =
                    createModuleIfMissing(
                            moduleRepository,
                            "CUSTOMERS",
                            "Customers",
                            "Customer records and customer management."
                    );

            AdminModule dashboard =
                    createModuleIfMissing(
                            moduleRepository,
                            "DASHBOARD",
                            "Dashboard",
                            "Administration dashboard, statistics and operational overview."
                    );

            AdminModule accountUsers =
                    createModuleIfMissing(
                            moduleRepository,
                            "ACCOUNT_USERS",
                            "Account Users",
                            "Employee and administrative user account management."
                    );

            AdminModule employeeRecords =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_RECORDS",
                            "Employee Records",
                            "Corporate employee records and employee profile management."
                    );

            AdminModule employeeAddress =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_ADDRESS",
                            "Employee Address",
                            "Employee address information and management."
                    );

            AdminModule employeeEmergencyContact =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_EMERGENCY_CONTACT",
                            "Employee Emergency Contacts",
                            "Employee emergency contact information and management."
                    );

            AdminModule employeeDocuments =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_DOCUMENTS",
                            "Employee Documents",
                            "Employee document records and document management."
                    );

            AdminModule employeeEmploymentHistory =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_EMPLOYMENT_HISTORY",
                            "Employment History",
                            "Employee previous employment and work history."
                    );

            AdminModule employeeEducation =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_EDUCATION",
                            "Employee Education",
                            "Employee education and qualification records."
                    );

            AdminModule employeeSkills =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_SKILLS",
                            "Employee Skills",
                            "Employee skills, competencies and capability records."
                    );

            AdminModule employeeLifecycleHistory =
                    createModuleIfMissing(
                            moduleRepository,
                            "EMPLOYEE_LIFECYCLE_HISTORY",
                            "Employee Lifecycle History",
                            "Employee lifecycle and historical status information."
                    );


            // =====================================================
            // DASHBOARD
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    dashboard,
                    "DASHBOARD_VIEW",
                    "View Dashboard",
                    "Allows the admin to view the admin dashboard and its statistics."
            );


            // =====================================================
            // ACCOUNT USERS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_VIEW",
                    "View User Accounts",
                    "Allows the authorized account manager to view employee and admin accounts."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_CREATE",
                    "Create User Accounts",
                    "Allows the authorized account manager to create employee and admin accounts."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_UPDATE",
                    "Update User Accounts",
                    "Allows the authorized account manager to update employee and admin account information."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_DISABLE",
                    "Disable User Accounts",
                    "Allows the authorized account manager to disable employee and admin accounts."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_ENABLE",
                    "Enable User Accounts",
                    "Allows the authorized account manager to enable approved employee and admin accounts."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_DELETE",
                    "Delete User Accounts",
                    "Allows the authorized account manager to delete employee and admin accounts."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_PASSWORD",
                    "Manage User Passwords",
                    "Allows the authorized account manager to reset or change employee and admin passwords."
            );

            createIfMissing(
                    permissionRepository,
                    accountUsers,
                    "ACCOUNT_USERS_PERMISSIONS",
                    "Manage User Permissions",
                    "Allows the authorized account manager to assign or remove permitted permissions from employee and admin accounts."
            );


            // =====================================================
            // EMPLOYEE RECORDS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeRecords,
                    "EMPLOYEE_RECORDS_VIEW",
                    "View Employee Records",
                    "Allows authorized personnel to view corporate employee records and employee profile information."
            );

            createIfMissing(
                    permissionRepository,
                    employeeRecords,
                    "EMPLOYEE_RECORDS_CREATE",
                    "Create Employee Records",
                    "Allows authorized personnel to create corporate employee records."
            );

            createIfMissing(
                    permissionRepository,
                    employeeRecords,
                    "EMPLOYEE_RECORDS_UPDATE",
                    "Update Employee Records",
                    "Allows authorized personnel to update corporate employee records."
            );


            // =====================================================
            // EMPLOYEE ADDRESS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeAddress,
                    "EMPLOYEE_ADDRESS_VIEW",
                    "View Employee Addresses",
                    "Allows authorized personnel to view employee addresses."
            );

            createIfMissing(
                    permissionRepository,
                    employeeAddress,
                    "EMPLOYEE_ADDRESS_CREATE",
                    "Create Employee Addresses",
                    "Allows authorized personnel to create employee addresses."
            );

            createIfMissing(
                    permissionRepository,
                    employeeAddress,
                    "EMPLOYEE_ADDRESS_UPDATE",
                    "Update Employee Addresses",
                    "Allows authorized personnel to update employee addresses."
            );

            createIfMissing(
                    permissionRepository,
                    employeeAddress,
                    "EMPLOYEE_ADDRESS_DELETE",
                    "Delete Employee Addresses",
                    "Allows authorized personnel to delete employee addresses."
            );


            // =====================================================
            // EMPLOYEE EMERGENCY CONTACT
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeEmergencyContact,
                    "EMPLOYEE_EMERGENCY_CONTACT_VIEW",
                    "View Emergency Contacts",
                    "Allows authorized personnel to view employee emergency contacts."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmergencyContact,
                    "EMPLOYEE_EMERGENCY_CONTACT_CREATE",
                    "Create Emergency Contacts",
                    "Allows authorized personnel to create employee emergency contacts."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmergencyContact,
                    "EMPLOYEE_EMERGENCY_CONTACT_UPDATE",
                    "Update Emergency Contacts",
                    "Allows authorized personnel to update employee emergency contacts."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmergencyContact,
                    "EMPLOYEE_EMERGENCY_CONTACT_DELETE",
                    "Delete Emergency Contacts",
                    "Allows authorized personnel to delete employee emergency contacts."
            );


            // =====================================================
            // EMPLOYEE DOCUMENTS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeDocuments,
                    "EMPLOYEE_DOCUMENT_VIEW",
                    "View Employee Documents",
                    "Allows authorized personnel to view employee documents."
            );

            createIfMissing(
                    permissionRepository,
                    employeeDocuments,
                    "EMPLOYEE_DOCUMENT_CREATE",
                    "Create Employee Documents",
                    "Allows authorized personnel to create employee documents."
            );

            createIfMissing(
                    permissionRepository,
                    employeeDocuments,
                    "EMPLOYEE_DOCUMENT_UPDATE",
                    "Update Employee Documents",
                    "Allows authorized personnel to update employee documents."
            );

            createIfMissing(
                    permissionRepository,
                    employeeDocuments,
                    "EMPLOYEE_DOCUMENT_DELETE",
                    "Delete Employee Documents",
                    "Allows authorized personnel to delete employee documents."
            );


            // =====================================================
            // EMPLOYEE EMPLOYMENT HISTORY
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeEmploymentHistory,
                    "EMPLOYEE_EMPLOYMENT_HISTORY_VIEW",
                    "View Employee Employment History",
                    "Allows authorized personnel to view an employee's previous employment history."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmploymentHistory,
                    "EMPLOYEE_EMPLOYMENT_HISTORY_CREATE",
                    "Create Employee Employment History",
                    "Allows authorized personnel to add previous employment history for an employee."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmploymentHistory,
                    "EMPLOYEE_EMPLOYMENT_HISTORY_UPDATE",
                    "Update Employee Employment History",
                    "Allows authorized personnel to update an employee's previous employment history."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEmploymentHistory,
                    "EMPLOYEE_EMPLOYMENT_HISTORY_DELETE",
                    "Delete Employee Employment History",
                    "Allows authorized personnel to delete an employee's previous employment history."
            );


            // =====================================================
            // EMPLOYEE EDUCATION
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeEducation,
                    "EMPLOYEE_EDUCATION_VIEW",
                    "View Employee Education",
                    "Allows authorized personnel to view employee education and qualification records."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEducation,
                    "EMPLOYEE_EDUCATION_CREATE",
                    "Create Employee Education",
                    "Allows authorized personnel to create employee education and qualification records."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEducation,
                    "EMPLOYEE_EDUCATION_UPDATE",
                    "Update Employee Education",
                    "Allows authorized personnel to update employee education and qualification records."
            );

            createIfMissing(
                    permissionRepository,
                    employeeEducation,
                    "EMPLOYEE_EDUCATION_DELETE",
                    "Delete Employee Education",
                    "Allows authorized personnel to delete employee education and qualification records."
            );


            // =====================================================
            // EMPLOYEE SKILLS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeSkills,
                    "EMPLOYEE_SKILL_VIEW",
                    "View Employee Skills",
                    "Allows authorized personnel to view employee skills and competencies."
            );

            createIfMissing(
                    permissionRepository,
                    employeeSkills,
                    "EMPLOYEE_SKILL_CREATE",
                    "Create Employee Skills",
                    "Allows authorized personnel to create employee skills and competencies."
            );

            createIfMissing(
                    permissionRepository,
                    employeeSkills,
                    "EMPLOYEE_SKILL_UPDATE",
                    "Update Employee Skills",
                    "Allows authorized personnel to update employee skills and competencies."
            );

            createIfMissing(
                    permissionRepository,
                    employeeSkills,
                    "EMPLOYEE_SKILL_DELETE",
                    "Delete Employee Skills",
                    "Allows authorized personnel to delete employee skills and competencies."
            );


            // =====================================================
            // EMPLOYEE LIFECYCLE HISTORY
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    employeeLifecycleHistory,
                    "EMPLOYEE_LIFECYCLE_HISTORY_VIEW",
                    "View Employee Lifecycle History",
                    "Allows authorized personnel to view employee lifecycle history."
            );


            // =====================================================
            // PRODUCTS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    products,
                    "PRODUCTS_VIEW",
                    "View Products",
                    "Allows the admin to view products."
            );

            createIfMissing(
                    permissionRepository,
                    products,
                    "PRODUCTS_MANAGE",
                    "Manage Products",
                    "Allows the admin to create, update and delete products."
            );


            // =====================================================
            // ORDERS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    orders,
                    "ORDERS_VIEW",
                    "View Orders",
                    "Allows the admin to view customer orders."
            );

            createIfMissing(
                    permissionRepository,
                    orders,
                    "ORDERS_MANAGE",
                    "Manage Orders",
                    "Allows the admin to update and manage orders."
            );


            // =====================================================
            // INVENTORY
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    inventory,
                    "INVENTORY_VIEW",
                    "View Inventory",
                    "Allows the admin to view inventory."
            );

            createIfMissing(
                    permissionRepository,
                    inventory,
                    "INVENTORY_MANAGE",
                    "Manage Inventory",
                    "Allows the admin to update inventory and stock."
            );


            // =====================================================
            // PAYMENTS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    payments,
                    "PAYMENTS_VIEW",
                    "View Payments",
                    "Allows the admin to view payment information."
            );

            createIfMissing(
                    permissionRepository,
                    payments,
                    "PAYMENTS_MANAGE",
                    "Manage Payments",
                    "Allows the admin to manage payment-related operations."
            );


            // =====================================================
            // CUSTOMERS
            // =====================================================

            createIfMissing(
                    permissionRepository,
                    customers,
                    "CUSTOMERS_VIEW",
                    "View Customers",
                    "Allows the admin to view customers."
            );

            createIfMissing(
                    permissionRepository,
                    customers,
                    "CUSTOMERS_MANAGE",
                    "Manage Customers",
                    "Allows the admin to manage customer information."
            );
        };
    }


    // =========================================================
    // CREATE MODULE IF MISSING
    // =========================================================

    private AdminModule createModuleIfMissing(
            AdminModuleRepository repository,
            String code,
            String name,
            String description) {

        AdminModule module =
                repository
                        .findByCodeIgnoreCase(code)
                        .orElse(null);

        if (module != null) {

            boolean changed = false;

            if (!name.equals(module.getName())) {
                module.setName(name);
                changed = true;
            }

            if (!description.equals(module.getDescription())) {
                module.setDescription(description);
                changed = true;
            }

            if (!module.isEnabled()) {
                module.setEnabled(true);
                changed = true;
            }

            if (changed) {
                module = repository.save(module);
            }

            return module;
        }

        return repository.save(
                new AdminModule(
                        code,
                        name,
                        description
                )
        );
    }


    // =========================================================
    // CREATE / REPAIR PERMISSION
    // =========================================================

    private void createIfMissing(
            AdminPermissionRepository repository,
            AdminModule module,
            String code,
            String name,
            String description) {

        AdminPermission permission =
                repository
                        .findByCodeIgnoreCase(code)
                        .orElse(null);

        // -----------------------------------------------------
        // CREATE
        // -----------------------------------------------------

        if (permission == null) {

            repository.save(
                    new AdminPermission(
                            module,
                            code,
                            name,
                            description
                    )
            );

            return;
        }

        // -----------------------------------------------------
        // REPAIR EXISTING PERMISSION
        // -----------------------------------------------------

        boolean changed = false;

        if (permission.getModule() == null ||
                permission.getModule().getId() == null ||
                !permission.getModule()
                        .getId()
                        .equals(module.getId())) {

            permission.setModule(module);
            changed = true;
        }

        if (!name.equals(permission.getName())) {
            permission.setName(name);
            changed = true;
        }

        if (!description.equals(permission.getDescription())) {
            permission.setDescription(description);
            changed = true;
        }

        if (!permission.isEnabled()) {
            permission.setEnabled(true);
            changed = true;
        }

        if (changed) {
            repository.save(permission);
        }
    }
}