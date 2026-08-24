package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_documents",
        indexes = {
                @Index(
                        name = "idx_employee_documents_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employee_documents_type",
                        columnList = "document_type"
                ),
                @Index(
                        name = "idx_employee_documents_verification",
                        columnList = "verification_status"
                ),
                @Index(
                        name = "idx_employee_documents_expiry",
                        columnList = "expiry_date"
                )
        }
)
public class EmployeeDocument {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // =========================================================
    // EMPLOYEE
    // =========================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "employee_id",
            nullable = false
    )
    private EmployeeRecord employee;

    // =========================================================
    // DOCUMENT CLASSIFICATION
    // =========================================================

    @Column(
            name = "document_type",
            nullable = false,
            length = 80
    )
    private String documentType;

    @Column(
            name = "document_category",
            length = 80
    )
    private String documentCategory;

    @Column(
            name = "document_name",
            nullable = false,
            length = 255
    )
    private String documentName;

    // =========================================================
    // DOCUMENT REFERENCE
    // =========================================================
    //
    // Do not store the actual sensitive document contents here.
    //

    @Column(
            name = "document_number",
            length = 150
    )
    private String documentNumber;

    @Column(
            name = "document_reference",
            length = 500
    )
    private String documentReference;

    // =========================================================
    // FILE METADATA
    // =========================================================

    @Column(
            name = "file_reference",
            length = 1000
    )
    private String fileReference;

    @Column(
            name = "original_file_name",
            length = 255
    )
    private String originalFileName;

    @Column(
            name = "content_type",
            length = 100
    )
    private String contentType;

    @Column(
            name = "file_size_bytes"
    )
    private Long fileSizeBytes;

    // =========================================================
    // DOCUMENT DATES
    // =========================================================

    @Column(
            name = "issue_date"
    )
    private LocalDate issueDate;

    @Column(
            name = "expiry_date"
    )
    private LocalDate expiryDate;

    // =========================================================
    // VERIFICATION
    // =========================================================

    @Column(
            name = "verification_status",
            nullable = false,
            length = 40
    )
    private String verificationStatus = "PENDING";

    @Column(
            name = "verified_by",
            length = 150
    )
    private String verifiedBy;

    @Column(
            name = "verified_at"
    )
    private LocalDateTime verifiedAt;

    @Column(
            name = "verification_notes",
            length = 1000
    )
    private String verificationNotes;

    // =========================================================
    // STATUS
    // =========================================================

    @Column(
            nullable = false
    )
    private boolean active = true;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeDocument() {
    }

    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    // =========================================================
    // PRE-UPDATE
    // =========================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EmployeeRecord getEmployee() {
        return employee;
    }

    public void setEmployee(
            EmployeeRecord employee) {

        this.employee = employee;
    }

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

        this.documentCategory =
                documentCategory;
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

        this.documentNumber =
                documentNumber;
    }

    public String getDocumentReference() {
        return documentReference;
    }

    public void setDocumentReference(
            String documentReference) {

        this.documentReference =
                documentReference;
    }

    public String getFileReference() {
        return fileReference;
    }

    public void setFileReference(
            String fileReference) {

        this.fileReference =
                fileReference;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(
            String originalFileName) {

        this.originalFileName =
                originalFileName;
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

        this.fileSizeBytes =
                fileSizeBytes;
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

        this.verificationStatus =
                verificationStatus;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(
            String verifiedBy) {

        this.verifiedBy = verifiedBy;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(
            LocalDateTime verifiedAt) {

        this.verifiedAt = verifiedAt;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(
            String verificationNotes) {

        this.verificationNotes =
                verificationNotes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active) {

        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}