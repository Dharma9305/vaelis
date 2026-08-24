package vaelis_api.service;

import vaelis_api.dto.EmployeeDocumentRequest;
import vaelis_api.entity.EmployeeDocument;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeDocumentRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EmployeeDocumentManagementService {

    private static final String VIEW =
            "EMPLOYEE_DOCUMENT_VIEW";

    private static final String CREATE =
            "EMPLOYEE_DOCUMENT_CREATE";

    private static final String UPDATE =
            "EMPLOYEE_DOCUMENT_UPDATE";

    private static final String DELETE =
            "EMPLOYEE_DOCUMENT_DELETE";

    private static final String STATUS_PENDING =
            "PENDING";

    private static final String STATUS_VERIFIED =
            "VERIFIED";

    private final EmployeeDocumentRepository documentRepository;

    private final EmployeeRecordRepository employeeRepository;

    private final AdminAuthorizationService authorizationService;

    private final AdminActivityLogService activityLogService;

    public EmployeeDocumentManagementService(
            EmployeeDocumentRepository documentRepository,
            EmployeeRecordRepository employeeRepository,
            AdminAuthorizationService authorizationService,
            AdminActivityLogService activityLogService) {

        this.documentRepository =
                documentRepository;

        this.employeeRepository =
                employeeRepository;

        this.authorizationService =
                authorizationService;

        this.activityLogService =
                activityLogService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeDocument> getAllDocuments(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        List<EmployeeDocument> documents =
                documentRepository
                        .findByEmployeeIdOrderByCreatedAtDesc(
                                employeeId
                        );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_LIST_VIEW",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Employee documents viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + documents.size(),
                "SUCCESS"
        );

        return documents;
    }

    // =========================================================
    // GET ACTIVE
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeDocument> getActiveDocuments(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        List<EmployeeDocument> documents =
                documentRepository
                        .findByEmployeeIdAndActiveTrueOrderByCreatedAtDesc(
                                employeeId
                        );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_ACTIVE_LIST_VIEW",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Active employee documents viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + documents.size(),
                "SUCCESS"
        );

        return documents;
    }

    // =========================================================
    // GET SINGLE
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeDocument getDocument(
            Long employeeId,
            Long documentId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        EmployeeDocument document =
                getDocumentForEmployee(
                        employeeId,
                        documentId
                );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_VIEW",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Employee document viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Document ID: "
                        + documentId,
                "SUCCESS"
        );

        return document;
    }

    // =========================================================
    // CREATE
    // =========================================================

    public EmployeeDocument createDocument(
            Long employeeId,
            EmployeeDocumentRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        validateRequest(request);

        EmployeeDocument document =
                new EmployeeDocument();

        document.setEmployee(employee);

        applyRequest(
                document,
                request
        );

        normalizeVerificationState(
                document,
                authentication
        );

        EmployeeDocument saved =
                documentRepository.save(
                        document
                );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_CREATE",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Employee document created. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Document ID: "
                        + saved.getId()
                        + ". Document name: "
                        + saved.getDocumentName(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public EmployeeDocument updateDocument(
            Long employeeId,
            Long documentId,
            EmployeeDocumentRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        validateRequest(request);

        EmployeeDocument document =
                getDocumentForEmployee(
                        employeeId,
                        documentId
                );

        String previousStatus =
                normalizeStatus(
                        document.getVerificationStatus()
                );

        applyRequest(
                document,
                request
        );

        normalizeVerificationState(
                document,
                authentication
        );

        String newStatus =
                normalizeStatus(
                        document.getVerificationStatus()
                );

        EmployeeDocument saved =
                documentRepository.save(
                        document
                );

        String verificationChangeDetails =
                buildVerificationChangeDetails(
                        previousStatus,
                        newStatus,
                        saved
                );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_UPDATE",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Employee document updated. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Document ID: "
                        + documentId
                        + ". "
                        + verificationChangeDetails,
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public void deleteDocument(
            Long employeeId,
            Long documentId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE
        );

        EmployeeRecord employee =
                getEmployee(employeeId);

        EmployeeDocument document =
                getDocumentForEmployee(
                        employeeId,
                        documentId
                );

        documentRepository.delete(
                document
        );

        activityLogService.log(
                "EMPLOYEE_DOCUMENT_DELETE",
                null,
                getActorUsername(authentication),
                "EMPLOYEE",
                "Employee document deleted. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Document ID: "
                        + documentId
                        + ". Document name: "
                        + document.getDocumentName(),
                "SUCCESS"
        );
    }

    // =========================================================
    // VERIFICATION STATE
    // =========================================================
    //
    // VERIFIED:
    // - verifiedAt is always generated by the server
    // - verifiedBy is always the authenticated actor
    //
    // PENDING:
    // - verifiedAt is cleared
    // - verifiedBy is cleared
    //
    // Any unsupported status is rejected.
    //

    private void normalizeVerificationState(
            EmployeeDocument document,
            Authentication authentication) {

        String status =
                normalizeStatus(
                        document.getVerificationStatus()
                );

        if (STATUS_PENDING.equals(status)) {

            document.setVerificationStatus(
                    STATUS_PENDING
            );

            document.setVerifiedAt(
                    null
            );

            document.setVerifiedBy(
                    null
            );

            return;
        }

        if (STATUS_VERIFIED.equals(status)) {

            String actorUsername =
                    getActorUsername(authentication);

            if (actorUsername == null ||
                    actorUsername.isBlank()) {

                throw new AdminPermissionDeniedException(
                        "Authenticated user is required to verify an employee document."
                );
            }

            document.setVerificationStatus(
                    STATUS_VERIFIED
            );

            document.setVerifiedAt(
                    LocalDateTime.now()
            );

            document.setVerifiedBy(
                    actorUsername
            );

            return;
        }

        throw new IllegalArgumentException(
                "Invalid verification status. "
                        + "Allowed values: PENDING, VERIFIED."
        );
    }

    // =========================================================
    // VERIFICATION CHANGE DETAILS
    // =========================================================

    private String buildVerificationChangeDetails(
            String previousStatus,
            String newStatus,
            EmployeeDocument document) {

        if (previousStatus.equals(
                newStatus
        )) {

            return "Verification status: "
                    + newStatus
                    + ".";
        }

        return "Verification status changed from "
                + previousStatus
                + " to "
                + newStatus
                + ". Verified by: "
                + (
                    document.getVerifiedBy() != null
                            ? document.getVerifiedBy()
                            : "N/A"
                )
                + ". Verified at: "
                + (
                    document.getVerifiedAt() != null
                            ? document.getVerifiedAt()
                            : "N/A"
                )
                + ".";
    }

    // =========================================================
    // EMPLOYEE
    // =========================================================

    private EmployeeRecord getEmployee(
            Long employeeId) {

        if (employeeId == null) {

            throw new IllegalArgumentException(
                    "Employee ID is required."
            );
        }

        return employeeRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee not found: "
                                        + employeeId
                        )
                );
    }

    // =========================================================
    // DOCUMENT
    // =========================================================

    private EmployeeDocument getDocumentForEmployee(
            Long employeeId,
            Long documentId) {

        if (documentId == null) {

            throw new IllegalArgumentException(
                    "Document ID is required."
            );
        }

        EmployeeDocument document =
                documentRepository
                        .findById(documentId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Employee document not found: "
                                                + documentId
                                )
                        );

        if (document.getEmployee() == null ||
                document.getEmployee().getId() == null ||
                !employeeId.equals(
                        document.getEmployee().getId()
                )) {

            throw new IllegalArgumentException(
                    "Employee document does not belong to employee."
            );
        }

        return document;
    }

    // =========================================================
    // PERMISSION
    // =========================================================

    private void requirePermission(
            Authentication authentication,
            String permission) {

        try {

            authorizationService.requirePermission(
                    authentication,
                    permission
            );

        } catch (AdminPermissionDeniedException ex) {

            activityLogService.log(
                    "EMPLOYEE_DOCUMENT_ACCESS_DENIED",
                    null,
                    getActorUsername(authentication),
                    "EMPLOYEE",
                    "Employee document access denied. "
                            + "Required permission: "
                            + permission
                            + ". Actor: "
                            + (
                                getActorUsername(authentication) != null
                                        ? getActorUsername(authentication)
                                        : "UNKNOWN"
                            ),
                    "DENIED"
            );

            throw ex;
        }
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateRequest(
            EmployeeDocumentRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Document request is required."
            );
        }

        if (request.getDocumentType() == null ||
                request.getDocumentType().isBlank()) {

            throw new IllegalArgumentException(
                    "Document type is required."
            );
        }

        if (request.getDocumentName() == null ||
                request.getDocumentName().isBlank()) {

            throw new IllegalArgumentException(
                    "Document name is required."
            );
        }

        if (request.getIssueDate() != null &&
                request.getExpiryDate() != null &&
                request.getExpiryDate()
                        .isBefore(
                                request.getIssueDate()
                        )) {

            throw new IllegalArgumentException(
                    "Expiry date cannot be before issue date."
            );
        }

        if (request.getFileSizeBytes() != null &&
                request.getFileSizeBytes() < 0) {

            throw new IllegalArgumentException(
                    "File size cannot be negative."
            );
        }
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeDocument document,
            EmployeeDocumentRequest request) {

        document.setDocumentType(
                normalizeRequired(
                        request.getDocumentType()
                )
        );

        document.setDocumentCategory(
                normalizeNullable(
                        request.getDocumentCategory()
                )
        );

        document.setDocumentName(
                normalizeRequired(
                        request.getDocumentName()
                )
        );

        document.setDocumentNumber(
                normalizeNullable(
                        request.getDocumentNumber()
                )
        );

        document.setDocumentReference(
                normalizeNullable(
                        request.getDocumentReference()
                )
        );

        document.setFileReference(
                normalizeNullable(
                        request.getFileReference()
                )
        );

        document.setOriginalFileName(
                normalizeNullable(
                        request.getOriginalFileName()
                )
        );

        document.setContentType(
                normalizeNullable(
                        request.getContentType()
                )
        );

        document.setFileSizeBytes(
                request.getFileSizeBytes()
        );

        document.setIssueDate(
                request.getIssueDate()
        );

        document.setExpiryDate(
                request.getExpiryDate()
        );

        String requestedStatus =
                normalizeStatus(
                        request.getVerificationStatus()
                );

        document.setVerificationStatus(
                requestedStatus
        );

        // IMPORTANT:
        // Never trust verifiedBy from the HTTP request.
        // normalizeVerificationState() determines it from
        // the authenticated actor.
        document.setVerifiedBy(
                null
        );

        document.setVerificationNotes(
                normalizeNullable(
                        request.getVerificationNotes()
                )
        );

       document.setActive(
        request.getActive()
        );
    }

    // =========================================================
    // STATUS NORMALIZATION
    // =========================================================

    private String normalizeStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            return STATUS_PENDING;
        }

        return status
                .trim()
                .toUpperCase();
    }

    // =========================================================
    // REQUIRED TEXT NORMALIZATION
    // =========================================================

    private String normalizeRequired(
            String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Required document field cannot be blank."
            );
        }

        return value.trim();
    }

    // =========================================================
    // NULLABLE TEXT NORMALIZATION
    // =========================================================

    private String normalizeNullable(
            String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            return null;
        }

        return value.trim();
    }

    // =========================================================
    // ACTOR USERNAME
    // =========================================================

    private String getActorUsername(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return null;
        }

        return authentication.getName();
    }
}