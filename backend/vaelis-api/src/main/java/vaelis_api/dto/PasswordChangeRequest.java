package vaelis_api.dto;

public class PasswordChangeRequest {

    private String password;

    public PasswordChangeRequest() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }
}