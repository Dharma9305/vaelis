package vaelis_api.dto;

public class DeletionRejectionRequest {

    private String reason;

    public DeletionRejectionRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}