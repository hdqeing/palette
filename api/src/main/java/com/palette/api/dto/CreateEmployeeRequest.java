package com.palette.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEmployeeRequest {
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String preferredLanguage;
    private String telephone;
    private String salutation;
    private Long companyId;
}