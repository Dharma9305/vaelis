package vaelis_api.service;

public class EmployeeAddressConflictException
        extends RuntimeException {

    public EmployeeAddressConflictException(
            String message) {

        super(message);
    }
}