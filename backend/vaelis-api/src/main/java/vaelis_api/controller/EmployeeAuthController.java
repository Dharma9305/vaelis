package vaelis_api.controller;

import vaelis_api.entity.AdminUser;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.AdminUserRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeAuthController {

    private final AdminUserRepository adminUserRepository;

    private final EmployeeRecordRepository employeeRecordRepository;

    public EmployeeAuthController(
            AdminUserRepository adminUserRepository,
            EmployeeRecordRepository employeeRecordRepository) {

        this.adminUserRepository =
                adminUserRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;
    }

    // =========================================================
    // CURRENT EMPLOYEE PROFILE
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEmployee(
            Authentication authentication) {

        // =====================================================
        // AUTHENTICATION CHECK
        // =====================================================

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "error",
                                    "Employee is not authenticated."
                            )
                    );
        }

        // =====================================================
        // EMPLOYEE ROLE CHECK
        // =====================================================

        boolean employeeRole =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(
                                "ROLE_EMPLOYEE"::equals
                        );

        if (!employeeRole) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "error",
                                    "Authenticated user is not an employee."
                            )
                    );
        }

        // =====================================================
        // FIND ADMIN USER ACCOUNT
        // =====================================================

        AdminUser adminUser =
                adminUserRepository
                        .findByUsernameIgnoreCaseAndDeletedFalse(
                                authentication.getName()
                        )
                        .orElse(null);

        if (adminUser == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "error",
                                    "Employee account was not found."
                            )
                    );
        }

        // =====================================================
        // ACCOUNT VALIDATION
        // =====================================================

        if (!"EMPLOYEE".equalsIgnoreCase(
                adminUser.getRole()
        )) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "error",
                                    "This account is not an employee account."
                            )
                    );
        }

        if (!adminUser.isEnabled()) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "error",
                                    "Employee account is disabled."
                            )
                    );
        }

        if (!adminUser.isApproved()) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "error",
                                    "Employee account is not approved."
                            )
                    );
        }

        // =====================================================
        // FIND EMPLOYEE RECORD
        // =====================================================

        EmployeeRecord employee =
                employeeRecordRepository
                        .findByAdminUserId(
                                adminUser.getId()
                        )
                        .orElse(null);

        if (employee == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "error",
                                    "Employee profile has not been created yet."
                            )
                    );
        }

        // =====================================================
        // BUILD RESPONSE
        // =====================================================

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "authenticated",
                true
        );

        response.put(
                "username",
                adminUser.getUsername()
        );

        response.put(
                "email",
                adminUser.getEmail()
        );

        response.put(
                "role",
                "EMPLOYEE"
        );

        // =====================================================
        // EMPLOYEE IDENTITY
        // =====================================================

        response.put(
                "employeeId",
                employee.getId()
        );

        response.put(
                "employeeCode",
                employee.getEmployeeCode()
        );

        response.put(
                "firstName",
                employee.getFirstName()
        );

        response.put(
                "middleName",
                employee.getMiddleName()
        );

        response.put(
                "lastName",
                employee.getLastName()
        );

        response.put(
                "preferredName",
                employee.getPreferredName()
        );

        // =====================================================
        // CONTACT
        // =====================================================

        response.put(
                "officialEmail",
                employee.getOfficialEmail()
        );

        response.put(
                "personalEmail",
                employee.getPersonalEmail()
        );

        response.put(
                "primaryMobile",
                employee.getPrimaryMobile()
        );

        response.put(
                "alternateMobile",
                employee.getAlternateMobile()
        );

        // =====================================================
        // EMPLOYMENT
        // =====================================================

        response.put(
                "dateOfJoining",
                employee.getDateOfJoining()
        );

        response.put(
                "employmentType",
                employee.getEmploymentType()
        );

        response.put(
                "employmentStatus",
                employee.getEmploymentStatus()
        );

        response.put(
                "department",
                employee.getDepartment()
        );

        response.put(
                "designation",
                employee.getDesignation()
        );

        response.put(
                "jobTitle",
                employee.getJobTitle()
        );

        response.put(
                "grade",
                employee.getGrade()
        );

        response.put(
                "workLocation",
                employee.getWorkLocation()
        );

        response.put(
                "branch",
                employee.getBranch()
        );

        response.put(
                "workMode",
                employee.getWorkMode()
        );

        response.put(
                "profileStatus",
                employee.getProfileStatus()
        );

        // =====================================================
        // RETURN
        // =====================================================

        return ResponseEntity.ok(
                response
        );
    }
}