package vaelis_api.dto;

import vaelis_api.entity.EmployeeDocument;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeDocumentResponse {

    private Long id;
    private Long employeeId;

    private String documentType;
    private String documentCategory;
    private String documentName;

    private String documentNumber;
    private String documentReference;

    private String fileReference;
    private String originalFileName;
    private String contentType;
    private Long fileSizeBytes;

    private LocalDate issueDate;
    private LocalDate expiryDate;

    private String verificationStatus;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private String verificationNotes;

    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeDocumentResponse() {
    }

    public static EmployeeDocumentResponse fromEntity(
            EmployeeDocument entity) {

        EmployeeDocumentResponse response =
                new EmployeeDocumentResponse();

        response.id = entity.getId();

        if (entity.getEmployee() != null) {
            response.employeeId =
                    entity.getEmployee().getId();
        }

        response.documentType =
                entity.getDocumentType();

        response.documentCategory =
                entity.getDocumentCategory();

        response.documentName =
                entity.getDocumentName();

        response.documentNumber =
                entity.getDocumentNumber();

        response.documentReference =
                entity.getDocumentReference();

        response.fileReference =
                entity.getFileReference();

        response.originalFileName =
                entity.getOriginalFileName();

        response.contentType =
                entity.getContentType();

        response.fileSizeBytes =
                entity.getFileSizeBytes();

        response.issueDate =
                entity.getIssueDate();

        response.expiryDate =
                entity.getExpiryDate();

        response.verificationStatus =
                entity.getVerificationStatus();

        response.verifiedBy =
                entity.getVerifiedBy();

        response.verifiedAt =
                entity.getVerifiedAt();

        response.verificationNotes =
                entity.getVerificationNotes();

        response.active =
                entity.isActive();

        response.createdAt =
                entity.getCreatedAt();

        response.updatedAt =
                entity.getUpdatedAt();

        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentCategory() {
        return documentCategory;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public String getDocumentReference() {
        return documentReference;
    }

    public String getFileReference() {
        return fileReference;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}