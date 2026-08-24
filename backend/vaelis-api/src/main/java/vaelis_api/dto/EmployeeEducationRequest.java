package vaelis_api.dto;

public class EmployeeEducationRequest {

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

    private Boolean active;

    public EmployeeEducationRequest() {
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(
            String educationLevel) {

        this.educationLevel =
                educationLevel;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(
            String qualification) {

        this.qualification =
                qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(
            String specialization) {

        this.specialization =
                specialization;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(
            String institution) {

        this.institution =
                institution;
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

        this.startYear =
                startYear;
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

        this.gradingType =
                gradingType;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }
}