package com.palette.api.dto;

import com.palette.api.model.Company;
import com.palette.api.model.CompanyRole;
import com.palette.api.model.Employee;
import lombok.Data;

@Data
public class EmployeeProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String preferredLanguage;
    private CompanyRole role;
    private CompanyInfo company;

    public EmployeeProfileResponse(Employee employee) {
        this.id = employee.getId();
        this.email = employee.getEmail();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.preferredLanguage = employee.getPreferredLanguage();
        this.role = employee.getCompanyRole();
        this.company = employee.getCompany() != null
                ? new CompanyInfo(employee.getCompany())
                : null;
    }

    public record CompanyInfo(
            Long id,
            String title,
            String city,
            String street,
            String houseNumber,
            String postalCode,
            String homepage,
            String vat,
            boolean verified,
            boolean isSeller
    ) {
        public CompanyInfo(Company company) {
            this(
                    company.getId(),
                    company.getTitle(),
                    company.getCity(),
                    company.getStreet(),
                    company.getHouseNumber(),
                    company.getPostalCode(),
                    company.getHomepage(),
                    company.getVat(),
                    company.isVerified(),
                    company.isSeller()
            );
        }
    }
}