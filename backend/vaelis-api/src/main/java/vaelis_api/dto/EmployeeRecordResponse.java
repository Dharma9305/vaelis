package vaelis_api.dto;

import vaelis_api.entity.EmployeeRecord;

import java.time.LocalDate;

public class EmployeeRecordResponse {

    // =========================================================
    // IDENTITY
    // =========================================================

    private Long id;

    private String employeeCode;

    private String firstName;

    private String middleName;

    private String lastName;

    private String preferredName;

    private LocalDate dateOfBirth;

    private String gender;

    private String nationality;

    private String maritalStatus;

    // =========================================================
    // CONTACT
    // =========================================================

    private String primaryMobile;

    private String alternateMobile;

    private String personalEmail;

    private String officialEmail;

    // =========================================================
    // EMPLOYMENT
    // =========================================================

    private String designation;

    private String jobTitle;

    private String department;

    private String grade;

    private String branch;

    private String workLocation;

    private String workMode;

    private String employmentType;

    private String employmentStatus;

    private LocalDate dateOfJoining;

    // =========================================================
    // PROFILE STATUS
    // =========================================================

    private String profileStatus;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeRecordResponse() {
    }

    // =========================================================
    // MAPPER
    // =========================================================

    public static EmployeeRecordResponse
    fromEntity(EmployeeRecord employee) {

        EmployeeRecordResponse response =
                new EmployeeRecordResponse();

        response.id =
                employee.getId();

        response.employeeCode =
                employee.getEmployeeCode();

        response.firstName =
                employee.getFirstName();

        response.middleName =
                employee.getMiddleName();

        response.lastName =
                employee.getLastName();

        response.preferredName =
                employee.getPreferredName();

        response.dateOfBirth =
                employee.getDateOfBirth();

        response.gender =
                employee.getGender();

        response.nationality =
                employee.getNationality();

        response.maritalStatus =
                employee.getMaritalStatus();

        response.primaryMobile =
                employee.getPrimaryMobile();

        response.alternateMobile =
                employee.getAlternateMobile();

        response.personalEmail =
                employee.getPersonalEmail();

        response.officialEmail =
                employee.getOfficialEmail();

        response.designation =
                employee.getDesignation();

        response.jobTitle =
                employee.getJobTitle();

        response.department =
                employee.getDepartment();

        response.grade =
                employee.getGrade();

        response.branch =
                employee.getBranch();

        response.workLocation =
                employee.getWorkLocation();

        response.workMode =
                employee.getWorkMode();

        response.employmentType =
                employee.getEmploymentType();

        response.employmentStatus =
                employee.getEmploymentStatus();

        response.dateOfJoining =
                employee.getDateOfJoining();

        response.profileStatus =
                employee.getProfileStatus();

        return response;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getNationality() {
        return nationality;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public String getPrimaryMobile() {
        return primaryMobile;
    }

    public String getAlternateMobile() {
        return alternateMobile;
    }

    public String getPersonalEmail() {
        return personalEmail;
    }

    public String getOfficialEmail() {
        return officialEmail;
    }

    public String getDesignation() {
        return designation;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getDepartment() {
        return department;
    }

    public String getGrade() {
        return grade;
    }

    public String getBranch() {
        return branch;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public String getWorkMode() {
        return workMode;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public LocalDate getDateOfJoining() {
        return dateOfJoining;
    }

    public String getProfileStatus() {
        return profileStatus;
    }
}