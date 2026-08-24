package vaelis_api.dto;

import vaelis_api.entity.EmployeeEducation;

import java.time.LocalDateTime;

public class EmployeeEducationResponse {

    private Long id;

    private Long employeeId;

    private String educationLevel;

    private String qualification;

    private String specialization;

    private String institution;

    private String universityOrBoard;

    private Integer startYear;

    private Integer completionYear;

    private String gradingType;

    private String gradeOrPercentage;

    private String registrationNumber;

    private String verificationStatus;

    private String certificateReference;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public EmployeeEducationResponse() {
    }

    public static EmployeeEducationResponse fromEntity(
            EmployeeEducation entity) {

        EmployeeEducationResponse response =
                new EmployeeEducationResponse();

        response.id =
                entity.getId();

        response.employeeId =
                entity.getEmployee() != null
                        ? entity.getEmployee().getId()
                        : null;

        response.educationLevel =
                entity.getEducationLevel();

        response.qualification =
                entity.getQualification();

        response.specialization =
                entity.getSpecialization();

        response.institution =
                entity.getInstitution();

        response.universityOrBoard =
                entity.getUniversityOrBoard();

        response.startYear =
                entity.getStartYear();

        response.completionYear =
                entity.getCompletionYear();

        response.gradingType =
                entity.getGradingType();

        response.gradeOrPercentage =
                entity.getGradeOrPercentage();

        response.registrationNumber =
                entity.getRegistrationNumber();

        response.verificationStatus =
                entity.getVerificationStatus();

        response.certificateReference =
                entity.getCertificateReference();

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

    public String getEducationLevel() {
        return educationLevel;
    }

    public String getQualification() {
        return qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getInstitution() {
        return institution;
    }

    public String getUniversityOrBoard() {
        return universityOrBoard;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public Integer getCompletionYear() {
        return completionYear;
    }

    public String getGradingType() {
        return gradingType;
    }

    public String getGradeOrPercentage() {
        return gradeOrPercentage;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public String getCertificateReference() {
        return certificateReference;
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