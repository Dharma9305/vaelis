package vaelis_api.service;

public class AdminPermissionDeniedException
        extends RuntimeException {

    public AdminPermissionDeniedException(
            String message) {

        super(message);
    }
}