package com.palette.api.dto;

import lombok.Data;

@Data
public class UpdateEmployeeRequest {
    private String email;
    private String verificationCode;
    private String password;
}
