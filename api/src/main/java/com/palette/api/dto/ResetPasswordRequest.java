package com.palette.api.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String verificationCode;
    private String newPassword;
}