package com.palette.api.controller;

import com.palette.api.dto.UpdateEmployeeRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Employee;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@RequestMapping("/v1/employee")
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;





}
