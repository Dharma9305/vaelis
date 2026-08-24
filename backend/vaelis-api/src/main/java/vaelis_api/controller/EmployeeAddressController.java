package vaelis_api.controller;

import vaelis_api.dto.EmployeeAddressRequest;
import vaelis_api.dto.EmployeeAddressResponse;
import vaelis_api.entity.EmployeeAddress;
import vaelis_api.service.EmployeeAddressManagementService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employees/{employeeId}/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeAddressController {

    private final EmployeeAddressManagementService
            employeeAddressManagementService;

    public EmployeeAddressController(
            EmployeeAddressManagementService employeeAddressManagementService) {

        this.employeeAddressManagementService =
                employeeAddressManagementService;
    }

    // =========================================================
    // GET ALL ADDRESSES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<EmployeeAddressResponse>>
    getAddresses(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeAddress> addresses =
                employeeAddressManagementService
                        .getAddresses(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                addresses.stream()
                        .map(
                                EmployeeAddressResponse::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET ACTIVE ADDRESSES
    // =========================================================

    @GetMapping("/active")
    public ResponseEntity<List<EmployeeAddressResponse>>
    getActiveAddresses(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeAddress> addresses =
                employeeAddressManagementService
                        .getActiveAddresses(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                addresses.stream()
                        .map(
                                EmployeeAddressResponse::fromEntity
                        )
                        .collect(Collectors.toList())
        );
    }

    // =========================================================
    // GET ADDRESS BY ID
    // =========================================================

    @GetMapping("/{addressId}")
    public ResponseEntity<EmployeeAddressResponse>
    getAddressById(
            @PathVariable Long employeeId,
            @PathVariable Long addressId,
            Authentication authentication) {

        EmployeeAddress address =
                employeeAddressManagementService
                        .getAddressById(
                                employeeId,
                                addressId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeAddressResponse
                        .fromEntity(address)
        );
    }

    // =========================================================
    // CREATE ADDRESS
    // =========================================================

    @PostMapping
    public ResponseEntity<EmployeeAddressResponse>
    createAddress(
            @PathVariable Long employeeId,
            @RequestBody EmployeeAddressRequest request,
            Authentication authentication) {

        EmployeeAddress address =
                employeeAddressManagementService
                        .createAddress(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        EmployeeAddressResponse
                                .fromEntity(address)
                );
    }

    // =========================================================
    // UPDATE ADDRESS
    // =========================================================

    @PutMapping("/{addressId}")
    public ResponseEntity<EmployeeAddressResponse>
    updateAddress(
            @PathVariable Long employeeId,
            @PathVariable Long addressId,
            @RequestBody EmployeeAddressRequest request,
            Authentication authentication) {

        EmployeeAddress address =
                employeeAddressManagementService
                        .updateAddress(
                                employeeId,
                                addressId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeAddressResponse
                        .fromEntity(address)
        );
    }

    // =========================================================
    // DELETE ADDRESS
    // =========================================================

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void>
    deleteAddress(
            @PathVariable Long employeeId,
            @PathVariable Long addressId,
            Authentication authentication) {

        employeeAddressManagementService
                .deleteAddress(
                        employeeId,
                        addressId,
                        authentication
                );

        return ResponseEntity.noContent()
                .build();
    }
}