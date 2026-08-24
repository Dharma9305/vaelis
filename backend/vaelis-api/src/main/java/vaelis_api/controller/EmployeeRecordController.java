package vaelis_api.controller;

import vaelis_api.dto.EmployeeRecordCreateRequest;
import vaelis_api.dto.EmployeeRecordResponse;
import vaelis_api.dto.EmployeeRecordUpdateRequest;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.service.EmployeeRecordAccessService;
import vaelis_api.service.EmployeeRecordManagementService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeRecordController {

    private final EmployeeRecordAccessService
            employeeRecordAccessService;

    private final EmployeeRecordManagementService
            employeeRecordManagementService;

    public EmployeeRecordController(
            EmployeeRecordAccessService employeeRecordAccessService,
            EmployeeRecordManagementService employeeRecordManagementService) {

        this.employeeRecordAccessService =
                employeeRecordAccessService;

        this.employeeRecordManagementService =
                employeeRecordManagementService;
    }

    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @PostMapping
    public ResponseEntity<EmployeeRecordResponse>
    createEmployee(
            @RequestBody EmployeeRecordCreateRequest request,
            Authentication authentication) {

        EmployeeRecord employee =
                employeeRecordManagementService
                        .createEmployee(
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        EmployeeRecordResponse
                                .fromEntity(employee)
                );
    }

    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @PutMapping("/{employeeId}")
    public ResponseEntity<EmployeeRecordResponse>
    updateEmployee(
            @PathVariable Long employeeId,
            @RequestBody EmployeeRecordUpdateRequest request,
            Authentication authentication) {

        EmployeeRecord employee =
                employeeRecordManagementService
                        .updateEmployee(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeRecordResponse
                        .fromEntity(employee)
        );
    }

    // =========================================================
    // LIST EMPLOYEES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<EmployeeRecordResponse>>
    getAllEmployees(
            Authentication authentication) {

        List<EmployeeRecord> employees =
                employeeRecordAccessService
                        .getAllEmployees(authentication);

        return ResponseEntity.ok(
                employees.stream()
                        .map(
                                EmployeeRecordResponse::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeRecordResponse>
    getEmployeeById(
            @PathVariable Long employeeId,
            Authentication authentication) {

        EmployeeRecord employee =
                employeeRecordAccessService
                        .getEmployeeById(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeRecordResponse
                        .fromEntity(employee)
        );
    }

    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    @GetMapping("/code/{employeeCode}")
    public ResponseEntity<EmployeeRecordResponse>
    getEmployeeByCode(
            @PathVariable String employeeCode,
            Authentication authentication) {

        EmployeeRecord employee =
                employeeRecordAccessService
                        .getEmployeeByCode(
                                employeeCode,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeRecordResponse
                        .fromEntity(employee)
        );
    }

    // =========================================================
    // GET BY DEPARTMENT
    // =========================================================

    @GetMapping("/department/{department}")
    public ResponseEntity<List<EmployeeRecordResponse>>
    getByDepartment(
            @PathVariable String department,
            Authentication authentication) {

        List<EmployeeRecord> employees =
                employeeRecordAccessService
                        .getByDepartment(
                                department,
                                authentication
                        );

        return ResponseEntity.ok(
                employees.stream()
                        .map(
                                EmployeeRecordResponse::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET BY EMPLOYMENT STATUS
    // =========================================================

    @GetMapping("/status/{employmentStatus}")
    public ResponseEntity<List<EmployeeRecordResponse>>
    getByEmploymentStatus(
            @PathVariable String employmentStatus,
            Authentication authentication) {

        List<EmployeeRecord> employees =
                employeeRecordAccessService
                        .getByEmploymentStatus(
                                employmentStatus,
                                authentication
                        );

        return ResponseEntity.ok(
                employees.stream()
                        .map(
                                EmployeeRecordResponse::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }
}