package vaelis_api.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AdminPermissionDeniedException
        extends RuntimeException {

    public AdminPermissionDeniedException(
            String message) {

        super(message);
    }
}