package vaelis_api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "employee_records",
        indexes = {
                @Index(
                        name = "idx_employee_records_code",
                        columnList = "employee_code",
                        unique = true
                ),
                @Index(
                        name = "idx_employee_records_status",
                        columnList = "employment_status"
                ),
                @Index(
                        name = "idx_employee_records_department",
                        columnList = "department"
                ),
                @Index(
                        name = "idx_employee_records_designation",
                        columnList = "designation"
                )
        }
)
public class EmployeeRecord {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    // =========================================================
    // AUTHENTICATED USER
    // =========================================================

    /**
     * Every individual employee has one corresponding
     * admin_users account.
     *
     * SUPER_ADMIN / VAELIS INDIA does not receive
     * an EmployeeRecord.
     */
    @OneToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "admin_user_id",
            nullable = false,
            unique = true
    )
    private AdminUser adminUser;

    // =========================================================
    // EMPLOYEE CODE
    // =========================================================

    @Column(
            name = "employee_code",
            nullable = false,
            unique = true,
            length = 30
    )
    private String employeeCode;

    // =========================================================
    // PERSONAL IDENTITY
    // =========================================================

    @Column(
            name = "first_name",
            nullable = false,
            length = 100
    )
    private String firstName;

    @Column(
            name = "middle_name",
            length = 100
    )
    private String middleName;

    @Column(
            name = "last_name",
            length = 100
    )
    private String lastName;

    @Column(
            name = "preferred_name",
            length = 100
    )
    private String preferredName;

    @Column(
            name = "date_of_birth"
    )
    private LocalDate dateOfBirth;

    @Column(
            length = 30
    )
    private String gender;

    @Column(
            name = "marital_status",
            length = 30
    )
    private String maritalStatus;

    @Column(
            length = 100
    )
    private String nationality;

    // =========================================================
    // CONTACT INFORMATION
    // =========================================================

    @Column(
            name = "official_email",
            length = 255
    )
    private String officialEmail;

    @Column(
            name = "personal_email",
            length = 255
    )
    private String personalEmail;

    @Column(
            name = "primary_mobile",
            length = 30
    )
    private String primaryMobile;

    @Column(
            name = "alternate_mobile",
            length = 30
    )
    private String alternateMobile;

    // =========================================================
    // EMPLOYMENT INFORMATION
    // =========================================================

    @Column(
            name = "date_of_joining"
    )
    private LocalDate dateOfJoining;

    @Column(
            name = "employment_type",
            length = 30
    )
    private String employmentType;

    @Column(
            name = "employment_status",
            nullable = false,
            length = 40
    )
    private String employmentStatus = "ACTIVE";

    @Column(
            length = 100
    )
    private String department;

    @Column(
            length = 100
    )
    private String designation;

    @Column(
            name = "job_title",
            length = 150
    )
    private String jobTitle;

    @Column(
            length = 50
    )
    private String grade;

    @Column(
            name = "work_location",
            length = 150
    )
    private String workLocation;

    @Column(
            length = 100
    )
    private String branch;

    // =========================================================
    // REPORTING STRUCTURE
    // =========================================================

    /**
     * Self-reference allows an employee to report to
     * another employee without storing a username as text.
     */
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "reporting_manager_id"
    )
    private EmployeeRecord reportingManager;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "functional_manager_id"
    )
    private EmployeeRecord functionalManager;

    @Column(
            name = "work_mode",
            length = 30
    )
    private String workMode;

    // =========================================================
    // PROFILE STATUS
    // =========================================================

    @Column(
            name = "profile_status",
            nullable = false,
            length = 40
    )
    private String profileStatus = "ACTIVE";

    // =========================================================
    // AUDIT TIMESTAMPS
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

    public EmployeeRecord() {
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

    public AdminUser getAdminUser() {
        return adminUser;
    }

    public void setAdminUser(
            AdminUser adminUser) {

        this.adminUser = adminUser;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(
            String employeeCode) {

        this.employeeCode = employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(
            String firstName) {

        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(
            String middleName) {

        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(
            String lastName) {

        this.lastName = lastName;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(
            String preferredName) {

        this.preferredName = preferredName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(
            LocalDate dateOfBirth) {

        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(
            String gender) {

        this.gender = gender;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(
            String maritalStatus) {

        this.maritalStatus = maritalStatus;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(
            String nationality) {

        this.nationality = nationality;
    }

    public String getOfficialEmail() {
        return officialEmail;
    }

    public void setOfficialEmail(
            String officialEmail) {

        this.officialEmail = officialEmail;
    }

    public String getPersonalEmail() {
        return personalEmail;
    }

    public void setPersonalEmail(
            String personalEmail) {

        this.personalEmail = personalEmail;
    }

    public String getPrimaryMobile() {
        return primaryMobile;
    }

    public void setPrimaryMobile(
            String primaryMobile) {

        this.primaryMobile = primaryMobile;
    }

    public String getAlternateMobile() {
        return alternateMobile;
    }

    public void setAlternateMobile(
            String alternateMobile) {

        this.alternateMobile = alternateMobile;
    }

    public LocalDate getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(
            LocalDate dateOfJoining) {

        this.dateOfJoining = dateOfJoining;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(
            String employmentType) {

        this.employmentType = employmentType;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(
            String employmentStatus) {

        this.employmentStatus = employmentStatus;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(
            String department) {

        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(
            String designation) {

        this.designation = designation;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(
            String jobTitle) {

        this.jobTitle = jobTitle;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(
            String grade) {

        this.grade = grade;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public void setWorkLocation(
            String workLocation) {

        this.workLocation = workLocation;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(
            String branch) {

        this.branch = branch;
    }

    public EmployeeRecord getReportingManager() {
        return reportingManager;
    }

    public void setReportingManager(
            EmployeeRecord reportingManager) {

        this.reportingManager =
                reportingManager;
    }

    public EmployeeRecord getFunctionalManager() {
        return functionalManager;
    }

    public void setFunctionalManager(
            EmployeeRecord functionalManager) {

        this.functionalManager =
                functionalManager;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(
            String workMode) {

        this.workMode = workMode;
    }

    public String getProfileStatus() {
        return profileStatus;
    }

    public void setProfileStatus(
            String profileStatus) {

        this.profileStatus = profileStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}