package vaelis_api.repository;

import vaelis_api.entity.EmployeeDocument;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeDocumentRepository
        extends JpaRepository<EmployeeDocument, Long> {

    // =========================================================
    // ALL DOCUMENTS FOR EMPLOYEE
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdOrderByCreatedAtDesc(
            Long employeeId
    );

    // =========================================================
    // ACTIVE DOCUMENTS
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdAndActiveTrueOrderByCreatedAtDesc(
            Long employeeId
    );

    // =========================================================
    // DOCUMENT TYPE
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdAndDocumentTypeIgnoreCase(
            Long employeeId,
            String documentType
    );

    // =========================================================
    // DOCUMENT CATEGORY
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdAndDocumentCategoryIgnoreCase(
            Long employeeId,
            String documentCategory
    );

    // =========================================================
    // VERIFICATION STATUS
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdAndVerificationStatusIgnoreCase(
            Long employeeId,
            String verificationStatus
    );

    // =========================================================
    // EXPIRING / EXPIRED DOCUMENTS
    // =========================================================

    List<EmployeeDocument>
    findByEmployeeIdAndExpiryDateIsNotNullOrderByExpiryDateAsc(
            Long employeeId
    );
}