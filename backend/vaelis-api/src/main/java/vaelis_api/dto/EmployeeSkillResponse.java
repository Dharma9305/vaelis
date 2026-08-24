package vaelis_api.dto;

import vaelis_api.entity.EmployeeSkill;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EmployeeSkillResponse {

    private Long id;

    private Long employeeId;

    private String skillName;

    private String skillCategory;

    private String skillLevel;

    private BigDecimal yearsOfExperience;

    private Integer lastUsedYear;

    private String certificationReference;

    private String verificationStatus;

    private String verificationReference;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // FROM ENTITY
    // =========================================================

    public static EmployeeSkillResponse fromEntity(
            EmployeeSkill entity) {

        EmployeeSkillResponse response =
                new EmployeeSkillResponse();

        response.id =
                entity.getId();

        if (entity.getEmployee() != null) {

            response.employeeId =
                    entity.getEmployee().getId();
        }

        response.skillName =
                entity.getSkillName();

        response.skillCategory =
                entity.getSkillCategory();

        response.skillLevel =
                entity.getSkillLevel();

        response.yearsOfExperience =
                entity.getYearsOfExperience();

        response.lastUsedYear =
                entity.getLastUsedYear();

        response.certificationReference =
                entity.getCertificationReference();

        response.verificationStatus =
                entity.getVerificationStatus();

        response.verificationReference =
                entity.getVerificationReference();

        response.active =
                entity.isActive();

        response.createdAt =
                entity.getCreatedAt();

        response.updatedAt =
                entity.getUpdatedAt();

        return response;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getSkillName() {
        return skillName;
    }

    public String getSkillCategory() {
        return skillCategory;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public Integer getLastUsedYear() {
        return lastUsedYear;
    }

    public String getCertificationReference() {
        return certificationReference;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public String getVerificationReference() {
        return verificationReference;
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