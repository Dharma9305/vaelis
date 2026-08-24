package vaelis_api.controller;

import vaelis_api.dto.EmployeeEmploymentHistoryRequest;
import vaelis_api.dto.EmployeeEmploymentHistoryResponse;
import vaelis_api.entity.EmployeeEmploymentHistory;
import vaelis_api.service.EmployeeEmploymentHistoryManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(
        "/api/admin/employees/{employeeId}/employment-history"
)
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class EmployeeEmploymentHistoryController {

    private final EmployeeEmploymentHistoryManagementService
            employmentHistoryManagementService;

    public EmployeeEmploymentHistoryController(
            EmployeeEmploymentHistoryManagementService
                    employmentHistoryManagementService) {

        this.employmentHistoryManagementService =
                employmentHistoryManagementService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            List<EmployeeEmploymentHistoryResponse>>
    getAllHistory(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEmploymentHistory> history =
                employmentHistoryManagementService
                        .getAllHistory(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeEmploymentHistoryResponse
                                        ::fromEntity
                        )
                        .collect(
                                Collectors.toList()
                        )
        );
    }

    // =========================================================
    // GET ACTIVE
    // =========================================================

    @GetMapping("/active")
    public ResponseEntity<
            List<EmployeeEmploymentHistoryResponse>>
    getActiveHistory(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEmploymentHistory> history =
                employmentHistoryManagementService
                        .getActiveHistory(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeEmploymentHistoryResponse
                                        ::fromEntity
                        )
                        .collect(
                                Collectors.toList()
                        )
        );
    }

    // =========================================================
    // GET SINGLE
    // =========================================================

    @GetMapping("/{historyId}")
    public ResponseEntity<
            EmployeeEmploymentHistoryResponse>
    getHistory(
            @PathVariable Long employeeId,
            @PathVariable Long historyId,
            Authentication authentication) {

        EmployeeEmploymentHistory history =
                employmentHistoryManagementService
                        .getHistory(
                                employeeId,
                                historyId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEmploymentHistoryResponse
                        .fromEntity(history)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<
            EmployeeEmploymentHistoryResponse>
    createHistory(
            @PathVariable Long employeeId,
            @RequestBody EmployeeEmploymentHistoryRequest request,
            Authentication authentication) {

        EmployeeEmploymentHistory history =
                employmentHistoryManagementService
                        .createHistory(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(201)
                .body(
                        EmployeeEmploymentHistoryResponse
                                .fromEntity(history)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{historyId}")
    public ResponseEntity<
            EmployeeEmploymentHistoryResponse>
    updateHistory(
            @PathVariable Long employeeId,
            @PathVariable Long historyId,
            @RequestBody EmployeeEmploymentHistoryRequest request,
            Authentication authentication) {

        EmployeeEmploymentHistory history =
                employmentHistoryManagementService
                        .updateHistory(
                                employeeId,
                                historyId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEmploymentHistoryResponse
                        .fromEntity(history)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{historyId}")
    public ResponseEntity<Void>
    deleteHistory(
            @PathVariable Long employeeId,
            @PathVariable Long historyId,
            Authentication authentication) {

        employmentHistoryManagementService
                .deleteHistory(
                        employeeId,
                        historyId,
                        authentication
                );

        return ResponseEntity
                .noContent()
                .build();
    }
}