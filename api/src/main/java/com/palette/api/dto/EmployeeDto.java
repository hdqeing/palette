package com.palette.api.dto;

public record EmployeeDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        String telephone,
        String username,
        String salutation,
        String preferredLanguage,
        CompanyRefDto company
) {}