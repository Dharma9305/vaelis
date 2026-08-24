package vaelis_api.controller;

import vaelis_api.dto.EmployeeLifecycleHistoryResponse;
import vaelis_api.entity.EmployeeLifecycleHistory;
import vaelis_api.service.EmployeeLifecycleHistoryManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeLifecycleHistoryController {

    private final EmployeeLifecycleHistoryManagementService
            employeeLifecycleHistoryManagementService;

    public EmployeeLifecycleHistoryController(
            EmployeeLifecycleHistoryManagementService
                    employeeLifecycleHistoryManagementService) {

        this.employeeLifecycleHistoryManagementService =
                employeeLifecycleHistoryManagementService;
    }

    // =========================================================
    // GET ALL LIFECYCLE HISTORY
    // =========================================================

    @GetMapping("/{employeeId}/lifecycle-history")
    public ResponseEntity<List<EmployeeLifecycleHistoryResponse>>
    getAllHistory(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeLifecycleHistory> history =
                employeeLifecycleHistoryManagementService
                        .getAllHistory(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeLifecycleHistoryResponse
                                        ::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET HISTORY BY EVENT TYPE
    // =========================================================

    @GetMapping(
            "/{employeeId}/lifecycle-history/event/{eventType}"
    )
    public ResponseEntity<List<EmployeeLifecycleHistoryResponse>>
    getHistoryByEventType(
            @PathVariable Long employeeId,
            @PathVariable String eventType,
            Authentication authentication) {

        List<EmployeeLifecycleHistory> history =
                employeeLifecycleHistoryManagementService
                        .getHistoryByEventType(
                                employeeId,
                                eventType,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeLifecycleHistoryResponse
                                        ::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET STATUS HISTORY
    // =========================================================

    @GetMapping(
            "/{employeeId}/lifecycle-history/status"
    )
    public ResponseEntity<List<EmployeeLifecycleHistoryResponse>>
    getStatusHistory(
            @PathVariable Long employeeId,
            @RequestParam String previousStatus,
            @RequestParam String newStatus,
            Authentication authentication) {

        List<EmployeeLifecycleHistory> history =
                employeeLifecycleHistoryManagementService
                        .getStatusHistory(
                                employeeId,
                                previousStatus,
                                newStatus,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeLifecycleHistoryResponse
                                        ::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET HISTORY BY EFFECTIVE DATE
    // =========================================================

    @GetMapping(
            "/{employeeId}/lifecycle-history/date/{effectiveDate}"
    )
    public ResponseEntity<List<EmployeeLifecycleHistoryResponse>>
    getHistoryByEffectiveDate(
            @PathVariable Long employeeId,
            @PathVariable LocalDate effectiveDate,
            Authentication authentication) {

        List<EmployeeLifecycleHistory> history =
                employeeLifecycleHistoryManagementService
                        .getHistoryByEffectiveDate(
                                employeeId,
                                effectiveDate,
                                authentication
                        );

        return ResponseEntity.ok(
                history.stream()
                        .map(
                                EmployeeLifecycleHistoryResponse
                                        ::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }
}