package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_education",
        indexes = {
                @Index(
                        name = "idx_employee_education_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employee_education_level",
                        columnList = "education_level"
                ),
                @Index(
                        name = "idx_employee_education_completion",
                        columnList = "completion_year"
                )
        }
)
public class EmployeeEducation {

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
    // EDUCATION LEVEL
    // =========================================================

    @Column(
            name = "education_level",
            nullable = false,
            length = 100
    )
    private String educationLevel;

    // =========================================================
    // QUALIFICATION
    // =========================================================

    @Column(
            nullable = false,
            length = 150
    )
    private String qualification;

    @Column(
            length = 200
    )
    private String specialization;

    // =========================================================
    // INSTITUTION
    // =========================================================

    @Column(
            nullable = false,
            length = 255
    )
    private String institution;

    @Column(
            name = "university_or_board",
            length = 255
    )
    private String universityOrBoard;

    // =========================================================
    // PERIOD
    // =========================================================

    @Column(
            name = "start_year"
    )
    private Integer startYear;

    @Column(
            name = "completion_year"
    )
    private Integer completionYear;

    // =========================================================
    // RESULT
    // =========================================================

    @Column(
            name = "grading_type",
            length = 50
    )
    private String gradingType;

    @Column(
            name = "grade_or_percentage",
            length = 50
    )
    private String gradeOrPercentage;

    // =========================================================
    // REGISTRATION
    // =========================================================

    @Column(
            name = "registration_number",
            length = 100
    )
    private String registrationNumber;

    // =========================================================
    // VERIFICATION
    // =========================================================

    @Column(
            name = "verification_status",
            nullable = false,
            length = 40
    )
    private String verificationStatus = "PENDING";

    // =========================================================
    // CERTIFICATE REFERENCE
    // =========================================================
    //
    // This is a reference only.
    // Actual document storage will be handled by the
    // employee document module.
    //

    @Column(
            name = "certificate_reference",
            length = 500
    )
    private String certificateReference;

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

    public EmployeeEducation() {
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

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(
            String educationLevel) {

        this.educationLevel = educationLevel;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(
            String qualification) {

        this.qualification = qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(
            String specialization) {

        this.specialization = specialization;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(
            String institution) {

        this.institution = institution;
    }

    public String getUniversityOrBoard() {
        return universityOrBoard;
    }

    public void setUniversityOrBoard(
            String universityOrBoard) {

        this.universityOrBoard =
                universityOrBoard;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(
            Integer startYear) {

        this.startYear = startYear;
    }

    public Integer getCompletionYear() {
        return completionYear;
    }

    public void setCompletionYear(
            Integer completionYear) {

        this.completionYear =
                completionYear;
    }

    public String getGradingType() {
        return gradingType;
    }

    public void setGradingType(
            String gradingType) {

        this.gradingType = gradingType;
    }

    public String getGradeOrPercentage() {
        return gradeOrPercentage;
    }

    public void setGradeOrPercentage(
            String gradeOrPercentage) {

        this.gradeOrPercentage =
                gradeOrPercentage;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(
            String registrationNumber) {

        this.registrationNumber =
                registrationNumber;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            String verificationStatus) {

        this.verificationStatus =
                verificationStatus;
    }

    public String getCertificateReference() {
        return certificateReference;
    }

    public void setCertificateReference(
            String certificateReference) {

        this.certificateReference =
                certificateReference;
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