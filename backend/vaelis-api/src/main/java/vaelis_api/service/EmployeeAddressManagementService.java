package vaelis_api.service;

import vaelis_api.dto.EmployeeAddressRequest;
import vaelis_api.entity.EmployeeAddress;
import vaelis_api.entity.EmployeeRecord;
import vaelis_api.repository.EmployeeAddressRepository;
import vaelis_api.repository.EmployeeRecordRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeAddressManagementService {

    private static final String VIEW_PERMISSION =
            "EMPLOYEE_ADDRESS_VIEW";

    private static final String CREATE_PERMISSION =
            "EMPLOYEE_ADDRESS_CREATE";

    private static final String UPDATE_PERMISSION =
            "EMPLOYEE_ADDRESS_UPDATE";

    private static final String DELETE_PERMISSION =
            "EMPLOYEE_ADDRESS_DELETE";

    private final EmployeeAddressRepository
            employeeAddressRepository;

    private final EmployeeRecordRepository
            employeeRecordRepository;

    private final AdminActivityLogService
            adminActivityLogService;

    private final AdminAuthorizationService
            adminAuthorizationService;

    public EmployeeAddressManagementService(
            EmployeeAddressRepository employeeAddressRepository,
            EmployeeRecordRepository employeeRecordRepository,
            AdminActivityLogService adminActivityLogService,
            AdminAuthorizationService adminAuthorizationService) {

        this.employeeAddressRepository =
                employeeAddressRepository;

        this.employeeRecordRepository =
                employeeRecordRepository;

        this.adminActivityLogService =
                adminActivityLogService;

        this.adminAuthorizationService =
                adminAuthorizationService;
    }

    // =========================================================
    // GET ALL ADDRESSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeAddress> getAddresses(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeAddress> addresses =
                employeeAddressRepository
                        .findByEmployeeIdOrderByAddressTypeAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee addresses viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + addresses.size(),
                "SUCCESS"
        );

        return addresses;
    }

    // =========================================================
    // GET ACTIVE ADDRESSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<EmployeeAddress> getActiveAddresses(
            Long employeeId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        List<EmployeeAddress> addresses =
                employeeAddressRepository
                        .findByEmployeeIdAndActiveTrueOrderByAddressTypeAsc(
                                employeeId
                        );

        adminActivityLogService.log(
                "EMPLOYEE_ACTIVE_ADDRESS_LIST_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Active employee addresses viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Records returned: "
                        + addresses.size(),
                "SUCCESS"
        );

        return addresses;
    }

    // =========================================================
    // GET ADDRESS BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public EmployeeAddress getAddressById(
            Long employeeId,
            Long addressId,
            Authentication authentication) {

        requirePermission(
                authentication,
                VIEW_PERMISSION,
                VIEW_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeAddress address =
                findAddress(addressId);

        validateAddressBelongsToEmployee(
                address,
                employee
        );

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_VIEW",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee address viewed. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Address ID: "
                        + address.getId(),
                "SUCCESS"
        );

        return address;
    }

    // =========================================================
    // CREATE ADDRESS
    // =========================================================

    @Transactional
    public EmployeeAddress createAddress(
            Long employeeId,
            EmployeeAddressRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                CREATE_PERMISSION,
                CREATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        validateRequest(request);

        String addressType =
                normalizeAddressType(
                        request.getAddressType()
                );

        // =====================================================
        // PREVENT DUPLICATE ADDRESS TYPE
        // =====================================================

        if (employeeAddressRepository
                .existsByEmployeeIdAndAddressTypeIgnoreCase(
                        employeeId,
                        addressType
                )) {

            throw new IllegalStateException(
                    "An address of type "
                            + addressType
                            + " already exists for this employee."
            );
        }

        EmployeeAddress address =
                new EmployeeAddress();

        address.setEmployee(employee);

        applyRequest(
                address,
                request,
                addressType,
                true
        );

        EmployeeAddress saved =
                employeeAddressRepository.save(
                        address
                );

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_CREATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee address created. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Address ID: "
                        + saved.getId()
                        + ". Address type: "
                        + saved.getAddressType(),
                "SUCCESS"
        );

        return saved;
    }

    // =========================================================
    // UPDATE ADDRESS
    // =========================================================

    @Transactional
    public EmployeeAddress updateAddress(
            Long employeeId,
            Long addressId,
            EmployeeAddressRequest request,
            Authentication authentication) {

        requirePermission(
                authentication,
                UPDATE_PERMISSION,
                UPDATE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeAddress address =
                findAddress(addressId);

        validateAddressBelongsToEmployee(
                address,
                employee
        );

        validateRequest(request);

        String addressType =
                normalizeAddressType(
                        request.getAddressType()
                );

        // =====================================================
        // PREVENT ADDRESS TYPE COLLISION
        // =====================================================

        List<EmployeeAddress> existingAddresses =
                employeeAddressRepository
                        .findByEmployeeIdAndAddressTypeIgnoreCase(
                                employeeId,
                                addressType
                        );

        for (EmployeeAddress existing :
                existingAddresses) {

            if (!existing.getId().equals(addressId)) {

                throw new IllegalStateException(
                        "An address of type "
                                + addressType
                                + " already exists for this employee."
                );
            }
        }

        applyRequest(
                address,
                request,
                addressType,
                address.isActive()
        );

        EmployeeAddress updated =
                employeeAddressRepository.save(
                        address
                );

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_UPDATE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee address updated. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Address ID: "
                        + updated.getId()
                        + ". Address type: "
                        + updated.getAddressType(),
                "SUCCESS"
        );

        return updated;
    }

    // =========================================================
    // DELETE ADDRESS
    // =========================================================

    @Transactional
    public void deleteAddress(
            Long employeeId,
            Long addressId,
            Authentication authentication) {

        requirePermission(
                authentication,
                DELETE_PERMISSION,
                DELETE_PERMISSION
        );

        EmployeeRecord employee =
                findEmployee(employeeId);

        EmployeeAddress address =
                findAddress(addressId);

        validateAddressBelongsToEmployee(
                address,
                employee
        );

        employeeAddressRepository.delete(
                address
        );

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_DELETE",
                employee.getId(),
                getEmployeeUsername(employee),
                "EMPLOYEE",
                "Employee address deleted. "
                        + "Employee code: "
                        + employee.getEmployeeCode()
                        + ". Address ID: "
                        + addressId
                        + ". Address type: "
                        + address.getAddressType(),
                "SUCCESS"
        );
    }

    // =========================================================
    // FIND EMPLOYEE
    // =========================================================

    private EmployeeRecord findEmployee(
            Long employeeId) {

        if (employeeId == null) {

            throw new IllegalArgumentException(
                    "Employee ID is required."
            );
        }

        return employeeRecordRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee record not found."
                        )
                );
    }

    // =========================================================
    // FIND ADDRESS
    // =========================================================

    private EmployeeAddress findAddress(
            Long addressId) {

        if (addressId == null) {

            throw new IllegalArgumentException(
                    "Address ID is required."
            );
        }

        return employeeAddressRepository
                .findById(addressId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Employee address not found."
                        )
                );
    }

    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateAddressBelongsToEmployee(
            EmployeeAddress address,
            EmployeeRecord employee) {

        if (address.getEmployee() == null ||
                address.getEmployee().getId() == null ||
                !address.getEmployee()
                        .getId()
                        .equals(employee.getId())) {

            throw new IllegalArgumentException(
                    "Employee address does not belong to the requested employee."
            );
        }
    }

    // =========================================================
    // REQUEST VALIDATION
    // =========================================================

    private void validateRequest(
            EmployeeAddressRequest request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Address request is required."
            );
        }

        requireText(
                request.getAddressType(),
                "Address type is required."
        );

        requireText(
                request.getAddressLine1(),
                "Address line 1 is required."
        );

        requireText(
                request.getCity(),
                "City is required."
        );

        requireText(
                request.getState(),
                "State is required."
        );

        requireText(
                request.getCountry(),
                "Country is required."
        );

        requireText(
                request.getPostalCode(),
                "Postal code is required."
        );
    }

    // =========================================================
    // APPLY REQUEST
    // =========================================================

    private void applyRequest(
            EmployeeAddress address,
            EmployeeAddressRequest request,
            String addressType,
            boolean defaultActive) {

        address.setAddressType(
                addressType
        );

        address.setAddressLine1(
                request.getAddressLine1().trim()
        );

        address.setAddressLine2(
                normalizeNullable(
                        request.getAddressLine2()
                )
        );

        address.setLandmark(
                normalizeNullable(
                        request.getLandmark()
                )
        );

        address.setCity(
                request.getCity().trim()
        );

        address.setState(
                request.getState().trim()
        );

        address.setDistrict(
                normalizeNullable(
                        request.getDistrict()
                )
        );

        address.setCountry(
                request.getCountry().trim()
        );

        address.setPostalCode(
                request.getPostalCode().trim()
        );

        address.setContactMobile(
                normalizeNullable(
                        request.getContactMobile()
                )
        );

        if (request.getActive() != null) {

            address.setActive(
                    request.getActive()
            );

        } else {

            address.setActive(
                    defaultActive
            );
        }
    }

    // =========================================================
    // ADDRESS TYPE NORMALIZATION
    // =========================================================

    private String normalizeAddressType(
            String addressType) {

        String value =
                addressType.trim()
                        .toUpperCase();

        if (!"CURRENT".equals(value) &&
                !"PERMANENT".equals(value) &&
                !"OTHER".equals(value)) {

            throw new IllegalArgumentException(
                    "Invalid address type. "
                            + "Allowed values: CURRENT, PERMANENT, OTHER."
            );
        }

        return value;
    }

    // =========================================================
    // REQUIRED TEXT
    // =========================================================

    private void requireText(
            String value,
            String message) {

        if (value == null ||
                value.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    message
            );
        }
    }

    // =========================================================
    // NULLABLE TEXT
    // =========================================================

    private String normalizeNullable(
            String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            return null;
        }

        return value.trim();
    }

    // =========================================================
    // TARGET USERNAME
    // =========================================================

    private String getEmployeeUsername(
            EmployeeRecord employee) {

        if (employee.getAdminUser() == null) {
            return null;
        }

        return employee
                .getAdminUser()
                .getUsername();
    }

    // =========================================================
    // PERMISSION CHECK
    // =========================================================
    //
    // IMPORTANT:
    // Permission authorization is delegated to the centralized
    // AdminAuthorizationService. This keeps employee address
    // authorization consistent with the rest of VAELIS.
    //

    private void requirePermission(
            Authentication authentication,
            String permission,
            String auditPermission) {

        if (adminAuthorizationService.hasPermission(
                authentication,
                permission
        )) {

            return;
        }

        String actorUsername =
                authentication != null
                        ? authentication.getName()
                        : "UNKNOWN";

        adminActivityLogService.log(
                "EMPLOYEE_ADDRESS_ACCESS_DENIED",
                null,
                null,
                "EMPLOYEE",
                "Employee address access denied. "
                        + "Required permission: "
                        + auditPermission
                        + ". Actor: "
                        + actorUsername,
                "DENIED"
        );

        throw new AdminPermissionDeniedException(
                "You do not have permission to access employee addresses."
        );
    }
}