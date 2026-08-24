package vaelis_api.dto;

import java.time.LocalDate;

public class EmployeeDocumentRequest {

    // =========================================================
    // DOCUMENT CLASSIFICATION
    // =========================================================

    private String documentType;
    private String documentCategory;
    private String documentName;

    // =========================================================
    // DOCUMENT REFERENCE
    // =========================================================

    private String documentNumber;
    private String documentReference;

    // =========================================================
    // FILE METADATA
    // =========================================================

    private String fileReference;
    private String originalFileName;
    private String contentType;
    private Long fileSizeBytes;

    // =========================================================
    // DOCUMENT DATES
    // =========================================================

    private LocalDate issueDate;
    private LocalDate expiryDate;

    // =========================================================
    // VERIFICATION
    // =========================================================

    private String verificationStatus;
    private String verifiedBy;
    private String verificationNotes;

    // =========================================================
    // STATUS
    // =========================================================

    private Boolean active;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeDocumentRequest() {
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(
            String documentType) {

        this.documentType = documentType;
    }

    public String getDocumentCategory() {
        return documentCategory;
    }

    public void setDocumentCategory(
            String documentCategory) {

        this.documentCategory = documentCategory;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(
            String documentName) {

        this.documentName = documentName;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(
            String documentNumber) {

        this.documentNumber = documentNumber;
    }

    public String getDocumentReference() {
        return documentReference;
    }

    public void setDocumentReference(
            String documentReference) {

        this.documentReference = documentReference;
    }

    public String getFileReference() {
        return fileReference;
    }

    public void setFileReference(
            String fileReference) {

        this.fileReference = fileReference;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(
            String originalFileName) {

        this.originalFileName = originalFileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(
            String contentType) {

        this.contentType = contentType;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(
            Long fileSizeBytes) {

        this.fileSizeBytes = fileSizeBytes;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(
            LocalDate issueDate) {

        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(
            LocalDate expiryDate) {

        this.expiryDate = expiryDate;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            String verificationStatus) {

        this.verificationStatus = verificationStatus;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(
            String verifiedBy) {

        this.verifiedBy = verifiedBy;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(
            String verificationNotes) {

        this.verificationNotes = verificationNotes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }
}