package vaelis_api.service;

import vaelis_api.dto.EmployeeEmergencyContactRequest;
import vaelis_api.entity.EmployeeEmergencyContact;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeEmergencyContactRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeEmergencyContactManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_EMERGENCY_CONTACT_VIEW";

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_EMERGENCY_CONTACT_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_EMERGENCY_CONTACT_UPDATE";

    private static final String DELETE_PERMISSION =
            "EMPLOYEE_EMERGENCY_CONTACT_DELETE";

    private final EmployeeEmergencyContactRepository
            emergencyContactRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminAuthorizationService
            adminAuthorizationService;

    private final AdminActivityLogService
            adminActivityLogService;

    public EmployeeEmergencyContactManagementService(
            EmployeeEmergencyContactRepository
                    emergencyContactRepository,
            EmployeeRecordRepository
                    employeeRecordRepository,
            AdminAuthorizationService
                    adminAuthorizationService,
            AdminActivityLogService
                    adminActivityLogService) {

        this.emergencyContactRepository =
                emergencyContactRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminAuthorizationService =
                adminAuthorizationService;

        this.adminActivityLogService =
                adminActivityLogService;
    }

    // =========================================================
    // GET ALL CONTACTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEmergencyContact>
    getAllContacts(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEmergencyContact> contacts =
                emergencyContactRepository
                        .findByEmployeeIdOrderByPrimaryDescContactNameAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_LIST_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Emergency contacts viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + contacts.size(),
                "SUCCESS"
        );

        return contacts;
    }

    // =========================================================
    // GET ACTIVE CONTACTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeEmergencyContact>
    getActiveContacts(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeEmergencyContact> contacts =
                emergencyContactRepository
                        .findByEmployeeIdAndActiveTrueOrderByPrimaryDescContactNameAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_ACTIVE_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Active emergency contacts viewed. Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + contacts.size(),
                "SUCCESS"
        );

        return contacts;
    }

    // =========================================================
    // GET SINGLE CONTACT
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeEmergencyContact
    getContact(
            Long employeeId,
            Long contactId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEmergencyContact contact =
                findContact(
                        employeeId,
                        contactId
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_VIEW",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Emergency contact viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Contact ID: "
                        + contact.getId(),
                "SUCCESS"
        );

        return contact;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Transactional
    public EmployeeEmergencyContact
    createContact(
            Long employeeId,
            EmployeeEmergencyContactRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        if (emergencyContactRepository
                .existsByEmployeeIdAndPrimaryMobile(
                        employeeId,
                        request.getPrimaryMobile()
                )) {

            throw new IllegalArgumentException(
                    "Emergency contact with this mobile number already exists."
            );
        }

        // =====================================================
        // PRIMARY CONTACT RULE
        // =====================================================

        if (request.isPrimary()) {

            clearExistingPrimaryContacts(
                    employee
            );
        }

        EmployeeEmergencyContact contact =
                new EmployeeEmergencyContact();

        contact.setEmployee(employee);

        applyRequest(
                contact,
                request
        );

        EmployeeEmergencyContact saved =
                emergencyContactRepository.save(
                        contact
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_CREATE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Emergency contact created. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Contact ID: "
                        + saved.getId()
                        + ". Contact name: "
                        + saved.getContactName(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Transactional
    public EmployeeEmergencyContact
    updateContact(
            Long employeeId,
            Long contactId,
            EmployeeEmergencyContactRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        EmployeeEmergencyContact contact =
                findContact(
                        employeeId,
                        contactId
                );

        if (!request.getPrimaryMobile()
                .equalsIgnoreCase(
                        contact.getPrimaryMobile()
                )
                &&
                emergencyContactRepository
                        .existsByEmployeeIdAndPrimaryMobile(
                                employeeId,
                                request.getPrimaryMobile()
                        )) {

            throw new IllegalArgumentException(
                    "Emergency contact with this mobile number already exists."
            );
        }

        if (request.isPrimary()) {

            clearExistingPrimaryContactsExcept(
                    employee,
                    contactId
            );
        }

        applyRequest(
                contact,
                request
        );

        EmployeeEmergencyContact saved =
                emergencyContactRepository.save(
                        contact
                );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_UPDATE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Emergency contact updated. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Contact ID: "
                        + saved.getId(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void deleteContact(
            Long employeeId,
            Long contactId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeEmergencyContact contact =
                findContact(
                        employeeId,
                        contactId
                );

        Long id =
                contact.getId();

        boolean wasPrimary =
                contact.isPrimary();

        emergencyContactRepository.delete(
                contact
        );

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_DELETE",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Emergency contact deleted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Contact ID: "
                        + id
                        + ". Was primary: "
                        + wasPrimary,
                "SUCCESS"
        );
    }

    // =========================================================
    // CLEAR EXISTING PRIMARY CONTACTS
    // =========================================================

    private void clearExistingPrimaryContacts(
            EmployeeRecord employee) {

        List<EmployeeEmergencyContact> contacts =
                emergencyContactRepository
                        .findByEmployeeIdAndPrimaryTrue(
                                employee.getId()
                        );

        for (EmployeeEmergencyContact contact :
                contacts) {

            contact.setPrimary(false);

            emergencyContactRepository.save(
                    contact
            );

            auditPrimaryContactDemotion(
                    employee,
                    contact,
                    null
            );
        }
    }

    // =========================================================
    // CLEAR PRIMARY EXCEPT CURRENT
    // =========================================================

    private void clearExistingPrimaryContactsExcept(
            EmployeeRecord employee,
            Long currentContactId) {

        List<EmployeeEmergencyContact> contacts =
                emergencyContactRepository
                        .findByEmployeeIdAndPrimaryTrue(
                                employee.getId()
                        );

        for (EmployeeEmergencyContact contact :
                contacts) {

            if (!contact.getId()
                    .equals(currentContactId)) {

                contact.setPrimary(false);

                emergencyContactRepository.save(
                        contact
                );

                auditPrimaryContactDemotion(
                        employee,
                        contact,
                        currentContactId
                );
            }
        }
    }

    // =========================================================
    // AUDIT PRIMARY CONTACT DEMOTION
    // =========================================================

    private void auditPrimaryContactDemotion(
            EmployeeRecord employee,
            EmployeeEmergencyContact previousPrimary,
            Long newPrimaryContactId) {

        String newPrimaryText =
                newPrimaryContactId == null
                        ? "New primary contact pending creation."
                        : "New primary contact ID: "
                                + newPrimaryContactId
                                + ".";

        adminActivityLogService.log(
                "EMPLOYEE_EMERGENCY_CONTACT_PRIMARY_CHANGED",
                employee.getId(),
                getTargetUsername(employee),
                "EMPLOYEE",
                "Previous primary emergency contact demoted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Previous primary contact ID: "
                        + previousPrimary.getId()
                        + ". Previous primary contact name: "
                        + previousPrimary.getContactName()
                        + ". "
                        + newPrimaryText,
                "SUCCESS"
        );
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeEmergencyContact contact,
            EmployeeEmergencyContactRequest request) {

        contact.setContactName(
                request.getContactName()
        );

        contact.setRelationship(
                request.getRelationship()
        );

        contact.setPrimaryMobile(
                request.getPrimaryMobile()
        );

        contact.setAlternateMobile(
                request.getAlternateMobile()
        );

        contact.setEmail(
                request.getEmail()
        );

        contact.setAddressLine1(
                request.getAddressLine1()
        );

        contact.setAddressLine2(
                request.getAddressLine2()
        );

        contact.setCity(
                request.getCity()
        );

        contact.setState(
                request.getState()
        );

        contact.setCountry(
                request.getCountry()
        );

        contact.setPostalCode(
                request.getPostalCode()
        );

        contact.setPrimary(
                request.isPrimary()
        );

        contact.setActive(
                request.isActive()
        );
    }

    // =========================================================
    // VALIDATE REQUEST
    // =========================================================

    private void validateRequest(
            EmployeeEmergencyContactRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Emergency contact request is required."
            );
        }

        if (isBlank(
                request.getContactName()
        )) {

            throw new IllegalArgumentException(
                    "Contact name is required."
            );
        }

        if (isBlank(
                request.getRelationship()
        )) {

            throw new IllegalArgumentException(
                    "Relationship is required."
            );
        }

        if (isBlank(
                request.getPrimaryMobile()
        )) {

            throw new IllegalArgumentException(
                    "Primary mobile is required."
            );
        }
    }

    // =========================================================
    // FIND EMPLOYEE
    // =========================================================

    private EmployeeRecord findEmployee(
            Long employeeId) {

        return employeeRecordRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee record not found."
                        )
                );
    }

    // =========================================================
    // FIND CONTACT
    // =========================================================

    private EmployeeEmergencyContact findContact(
            Long employeeId,
            Long contactId) {

        EmployeeEmergencyContact contact =
                emergencyContactRepository
                        .findById(contactId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Emergency contact not found."
                                )
                        );

        if (contact.getEmployee() == null ||
                !contact.getEmployee()
                        .getId()
                        .equals(employeeId)) {

            throw new IllegalArgumentException(
                    "Emergency contact does not belong to this employee."
            );
        }

        return contact;
    }

    // =========================================================
    // PERMISSION
    // =========================================================

    private void requirePermission(
            Authentication authentication,
            String permission) {

        try {

            adminAuthorizationService
                    .requirePermission(
                            authentication,
                            permission
                    );

        } catch (AdminPermissionDeniedException ex) {

            String actorUsername =
                    authentication != null
                            ? authentication.getName()
                            : "UNKNOWN";

            adminActivityLogService.log(
                    "EMPLOYEE_EMERGENCY_CONTACT_ACCESS_DENIED",
                    null,
                    null,
                    "EMPLOYEE",
                    "Employee emergency contact access denied. "
                            + "Required permission: "
                            + permission
                            + ". Actor: "
                            + actorUsername,
                    "DENIED"
            );

            throw ex;
        }
    }

    // =========================================================
    // TARGET USERNAME
    // =========================================================

    private String getTargetUsername(
            EmployeeRecord employee) {

        if (employee.getAdminUser() == null) {
            return null;
        }

        return employee
                .getAdminUser()
                .getUsername();
    }

    // =========================================================
    // STRING VALIDATION
    // =========================================================

    private boolean isBlank(String value) {

        return value == null ||
                value.isBlank();
    }
}