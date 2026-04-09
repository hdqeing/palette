package com.palette.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// DTO class for employee profile response
@Data
@AllArgsConstructor
public class EmployeeProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String preferredLanguage;
}