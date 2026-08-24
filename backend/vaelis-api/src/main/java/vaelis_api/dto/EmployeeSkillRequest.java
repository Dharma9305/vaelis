package vaelis_api.dto;

import java.math.BigDecimal;

public class EmployeeSkillRequest {

    // =========================================================
    // SKILL
    // =========================================================

    private String skillName;

    private String skillCategory;

    private String skillLevel;

    // =========================================================
    // EXPERIENCE
    // =========================================================

    private BigDecimal yearsOfExperience;

    private Integer lastUsedYear;

    // =========================================================
    // CERTIFICATION
    // =========================================================

    private String certificationReference;

    // =========================================================
    // VERIFICATION
    // =========================================================

    private String verificationStatus;

    private String verificationReference;

    // =========================================================
    // STATUS
    // =========================================================

    private Boolean active;

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

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

        this.skillCategory =
                skillCategory;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(
            String skillLevel) {

        this.skillLevel =
                skillLevel;
    }

    public BigDecimal getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(
            BigDecimal yearsOfExperience) {

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

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }
}