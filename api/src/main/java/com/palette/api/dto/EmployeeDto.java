package com.palette.api.dto;

import com.palette.api.model.Employee;

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
) {
    public static EmployeeDto from(Employee e) {
        CompanyRefDto companyRef = e.getCompany() == null ? null
                : new CompanyRefDto(e.getCompany().getId(), e.getCompany().getTitle());
        return new EmployeeDto(
                e.getId(),
                e.getEmail(),
                e.getFirstName(),
                e.getLastName(),
                e.getTelephone(),
                e.getUsername(),
                e.getSalutation(),
                e.getPreferredLanguage(),
                companyRef
        );
    }
}
