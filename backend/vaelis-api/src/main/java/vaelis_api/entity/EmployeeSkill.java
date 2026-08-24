package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_skills",
        indexes = {
                @Index(
                        name = "idx_employee_skills_employee",
                        columnList = "employee_id"
                ),
                @Index(
                        name = "idx_employee_skills_category",
                        columnList = "skill_category"
                ),
                @Index(
                        name = "idx_employee_skills_name",
                        columnList = "skill_name"
                ),
                @Index(
                        name = "idx_employee_skills_verification",
                        columnList = "verification_status"
                )
        }
)
public class EmployeeSkill {

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
    // SKILL
    // =========================================================

    @Column(
            name = "skill_name",
            nullable = false,
            length = 150
    )
    private String skillName;

    @Column(
            name = "skill_category",
            length = 100
    )
    private String skillCategory;

    @Column(
            name = "skill_level",
            length = 50
    )
    private String skillLevel;

    // =========================================================
    // EXPERIENCE
    // =========================================================

    @Column(
            name = "years_of_experience",
            precision = 5,
            scale = 2
    )
    private java.math.BigDecimal yearsOfExperience;

    // =========================================================
    // LAST USED
    // =========================================================

    @Column(
            name = "last_used_year"
    )
    private Integer lastUsedYear;

    // =========================================================
    // CERTIFICATION / REFERENCE
    // =========================================================

    @Column(
            name = "certification_reference",
            length = 500
    )
    private String certificationReference;

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
            name = "verification_reference",
            length = 500
    )
    private String verificationReference;

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

    public EmployeeSkill() {
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

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(
            String skillName) {

        this.skillName = skillName;
    }

    public String getSkillCategory() {
        return skillCategory;
    }

    public void setSkillCategory(
            String skillCategory) {

        this.skillCategory = skillCategory;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(
            String skillLevel) {

        this.skillLevel = skillLevel;
    }

    public java.math.BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(
            java.math.BigDecimal yearsOfExperience) {

        this.yearsOfExperience =
                yearsOfExperience;
    }

    public Integer getLastUsedYear() {
        return lastUsedYear;
    }

    public void setLastUsedYear(
            Integer lastUsedYear) {

        this.lastUsedYear =
                lastUsedYear;
    }

    public String getCertificationReference() {
        return certificationReference;
    }

    public void setCertificationReference(
            String certificationReference) {

        this.certificationReference =
                certificationReference;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            String verificationStatus) {

        this.verificationStatus =
                verificationStatus;
    }

    public String getVerificationReference() {
        return verificationReference;
    }

    public void setVerificationReference(
            String verificationReference) {

        this.verificationReference =
                verificationReference;
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