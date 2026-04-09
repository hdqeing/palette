package com.palette.api.dto;


import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String verificationCode;
    private String password;

}
