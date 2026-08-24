package vaelis_api.controller;

import vaelis_api.dto.EmployeeEducationRequest;
import vaelis_api.dto.EmployeeEducationResponse;
import vaelis_api.entity.EmployeeEducation;
import vaelis_api.service.EmployeeEducationManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(
        "/api/admin/employees/{employeeId}/education"
)
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class EmployeeEducationController {

    private final EmployeeEducationManagementService
            educationManagementService;

    public EmployeeEducationController(
            EmployeeEducationManagementService
                    educationManagementService) {

        this.educationManagementService =
                educationManagementService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            List<EmployeeEducationResponse>>
    getAllEducation(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEducation> records =
                educationManagementService
                        .getAllEducation(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                records.stream()
                        .map(
                                EmployeeEducationResponse
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
            List<EmployeeEducationResponse>>
    getActiveEducation(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEducation> records =
                educationManagementService
                        .getActiveEducation(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                records.stream()
                        .map(
                                EmployeeEducationResponse
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

    @GetMapping("/{educationId}")
    public ResponseEntity<
            EmployeeEducationResponse>
    getEducation(
            @PathVariable Long employeeId,
            @PathVariable Long educationId,
            Authentication authentication) {

        EmployeeEducation education =
                educationManagementService
                        .getEducation(
                                employeeId,
                                educationId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEducationResponse
                        .fromEntity(education)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<
            EmployeeEducationResponse>
    createEducation(
            @PathVariable Long employeeId,
            @RequestBody EmployeeEducationRequest request,
            Authentication authentication) {

        EmployeeEducation education =
                educationManagementService
                        .createEducation(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(201)
                .body(
                        EmployeeEducationResponse
                                .fromEntity(education)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{educationId}")
    public ResponseEntity<
            EmployeeEducationResponse>
    updateEducation(
            @PathVariable Long employeeId,
            @PathVariable Long educationId,
            @RequestBody EmployeeEducationRequest request,
            Authentication authentication) {

        EmployeeEducation education =
                educationManagementService
                        .updateEducation(
                                employeeId,
                                educationId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEducationResponse
                        .fromEntity(education)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void>
    deleteEducation(
            @PathVariable Long employeeId,
            @PathVariable Long educationId,
            Authentication authentication) {

        educationManagementService
                .deleteEducation(
                        employeeId,
                        educationId,
                        authentication
                );

        return ResponseEntity
                .noContent()
                .build();
    }
}