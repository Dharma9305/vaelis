package vaelis_api.controller;

import vaelis_api.dto.EmployeeDocumentRequest;
import vaelis_api.dto.EmployeeDocumentResponse;
import vaelis_api.entity.EmployeeDocument;
import vaelis_api.service.EmployeeDocumentManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(
        "/api/admin/employees/{employeeId}/documents"
)
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class EmployeeDocumentController {

    private final EmployeeDocumentManagementService
            documentManagementService;

    public EmployeeDocumentController(
            EmployeeDocumentManagementService
                    documentManagementService) {

        this.documentManagementService =
                documentManagementService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            List<EmployeeDocumentResponse>>
    getAllDocuments(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeDocument> documents =
                documentManagementService
                        .getAllDocuments(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                documents.stream()
                        .map(
                                EmployeeDocumentResponse
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
            List<EmployeeDocumentResponse>>
    getActiveDocuments(
            @PathVariable Long employeeId,
            Authentication authentication) {

        List<EmployeeDocument> documents =
                documentManagementService
                        .getActiveDocuments(
                                employeeId,
                                authentication
                        );

        return ResponseEntity.ok(
                documents.stream()
                        .map(
                                EmployeeDocumentResponse
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

    @GetMapping("/{documentId}")
    public ResponseEntity<
            EmployeeDocumentResponse>
    getDocument(
            @PathVariable Long employeeId,
            @PathVariable Long documentId,
            Authentication authentication) {

        EmployeeDocument document =
                documentManagementService
                        .getDocument(
                                employeeId,
                                documentId,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeDocumentResponse
                        .fromEntity(document)
        );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<
            EmployeeDocumentResponse>
    createDocument(
            @PathVariable Long employeeId,
            @RequestBody EmployeeDocumentRequest request,
            Authentication authentication) {

        EmployeeDocument document =
                documentManagementService
                        .createDocument(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(201)
                .body(
                        EmployeeDocumentResponse
                                .fromEntity(document)
                );
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{documentId}")
    public ResponseEntity<
            EmployeeDocumentResponse>
    updateDocument(
            @PathVariable Long employeeId,
            @PathVariable Long documentId,
            @RequestBody EmployeeDocumentRequest request,
            Authentication authentication) {

        EmployeeDocument document =
                documentManagementService
                        .updateDocument(
                                employeeId,
                                documentId,
                                request,
                                authentication
                        );

        return ResponseEntity.ok(
                EmployeeDocumentResponse
                        .fromEntity(document)
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void>
    deleteDocument(
            @PathVariable Long employeeId,
            @PathVariable Long documentId,
            Authentication authentication) {

        documentManagementService
                .deleteDocument(
                        employeeId,
                        documentId,
                        authentication
                );

        return ResponseEntity
                .noContent()
                .build();
    }
}