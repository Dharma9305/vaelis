package vaelis_api.controller;

import vaelis_api.dto.EmployeeEmergencyContactRequest;
import vaelis_api.dto.EmployeeEmergencyContactResponse;
import vaelis_api.entity.EmployeeEmergencyContact;
import vaelis_api.service.EmployeeEmergencyContactManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(
        "/api/admin/employees/{employeeId}/emergency-contacts"
)
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class EmployeeEmergencyContactController {

    private final EmployeeEmergencyContactManagementService
            emergencyContactManagementService;

    public EmployeeEmergencyContactController(
            EmployeeEmergencyContactManagementService
                    emergencyContactManagementService) {

        this.emergencyContactManagementService =
                emergencyContactManagementService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            List<EmployeeEmergencyContactResponse>>
    getAllContacts(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEmergencyContact> contacts =
                emergencyContactManagementService
                        .getAllContacts(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                contacts.stream()
                        .map(
                                EmployeeEmergencyContactResponse
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
            List<EmployeeEmergencyContactResponse>>
    getActiveContacts(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeEmergencyContact> contacts =
                emergencyContactManagementService
                        .getActiveContacts(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                contacts.stream()
                        .map(
                                EmployeeEmergencyContactResponse
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

    @GetMapping("/{contactId}")
    public ResponseEntity<
            EmployeeEmergencyContactResponse>
    getContact(
            @PathVariable Long employeeId,
            @PathVariable Long contactId,
            Authentication authentication) {

        EmployeeEmergencyContact contact =
                emergencyContactManagementService
                        .getContact(
                                employeeId,
                                contactId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEmergencyContactResponse
                        .fromEntity(contact)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<
            EmployeeEmergencyContactResponse>
    createContact(
            @PathVariable Long employeeId,
            @RequestBody EmployeeEmergencyContactRequest request,
            Authentication authentication) {

        EmployeeEmergencyContact contact =
                emergencyContactManagementService
                        .createContact(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(201)
                .body(
                        EmployeeEmergencyContactResponse
                                .fromEntity(contact)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{contactId}")
    public ResponseEntity<
            EmployeeEmergencyContactResponse>
    updateContact(
            @PathVariable Long employeeId,
            @PathVariable Long contactId,
            @RequestBody EmployeeEmergencyContactRequest request,
            Authentication authentication) {

        EmployeeEmergencyContact contact =
                emergencyContactManagementService
                        .updateContact(
                                employeeId,
                                contactId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeEmergencyContactResponse
                        .fromEntity(contact)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void>
    deleteContact(
            @PathVariable Long employeeId,
            @PathVariable Long contactId,
            Authentication authentication) {

        emergencyContactManagementService
                .deleteContact(
                        employeeId,
                        contactId,
                        authentication
                );

        return ResponseEntity.noContent()
                .build();
    }
}