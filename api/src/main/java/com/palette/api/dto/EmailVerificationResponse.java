package com.palette.api.dto;

public class EmailVerificationResponse {
    private String message;

    public EmailVerificationResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
