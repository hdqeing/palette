package com.palette.api.service;

import com.palette.api.dto.CreateEmployeeRequest;
import com.palette.api.dto.UpdateEmployeeRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Company;
import com.palette.api.model.Employee;
import com.palette.api.repository.CompanyRepository;
import com.palette.api.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private MailService mailService;

    public Employee createEmployee(CreateEmployeeRequest request) {
        Employee employee = getEmployee(request);

        //Create verification code and send email
        mailService.sendVerificationCode(employee, employee.getVerificationCode());


        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with id " + id + " not found"));

        employeeRepository.delete(employee);
    }

    private Employee getEmployee(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        employee.setEmail(request.getEmail());
        employee.setUsername(request.getUsername());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPreferredLanguage(request.getPreferredLanguage());
        employee.setTelephone(request.getTelephone());
        employee.setSalutation(request.getSalutation());
        employee.setEmailNotificationEnabled(false);

        String verificationCode = String.format("%06d", (new SecureRandom()).nextInt(1_000_000));
        ZonedDateTime expireAt = ZonedDateTime.now(ZoneId.systemDefault()).plusMinutes(30);
        employee.setVerificationCode(verificationCode);
        employee.setExpireAt(expireAt);

        if (request.getCompanyId() != null) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new IllegalArgumentException("Company not found"));
            employee.setCompany(company);
        }

        return employee;
    }

    public Employee updateEmployee(Employee employee, UpdateEmployeeRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            Employee existing = employeeRepository.findByEmail(request.getEmail()).orElse(null);
            if (existing != null && !existing.getId().equals(employee.getId())) {
                throw new IllegalArgumentException("Employee with this email already exists");
            }
            employee.setEmail(request.getEmail());
        }

        if (request.getUsername()          != null) employee.setUsername(request.getUsername());
        if (request.getFirstName()         != null) employee.setFirstName(request.getFirstName());
        if (request.getLastName()          != null) employee.setLastName(request.getLastName());
        if (request.getPreferredLanguage() != null) employee.setPreferredLanguage(request.getPreferredLanguage());
        if (request.getTelephone()         != null) employee.setTelephone(request.getTelephone());
        if (request.getSalutation()        != null) employee.setSalutation(request.getSalutation());

        if (request.getCompanyId()        != null) {
            Company company = companyRepository.findById(request.getCompanyId()).orElseThrow();
            employee.setCompany(company);
        };


        return employeeRepository.save(employee);
    }
}