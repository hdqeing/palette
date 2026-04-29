package com.palette.api.controller;

import com.palette.api.dto.CreateEmployeeRequest;
import com.palette.api.dto.UpdateEmployeeRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Employee;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.service.EmployeeService;
import com.palette.api.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequestMapping("/v1/employee")
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtDecoder jwtDecoder;

    @GetMapping
    ResponseEntity<List<Employee>> all(@CookieValue("jwt-token") String token){
        try {
            // Decode and validate JWT token
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            // Find employee by email
            Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
            if (employee.isAdmin()){
                return ResponseEntity.ok(employeeRepository.findAll());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.emptyList());

            }


        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }


    }

    @PostMapping
    public ResponseEntity<?> createEmployee(
            @RequestBody CreateEmployeeRequest request
    ) {
        try {
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Employee with this email already exists");
            }

            Employee savedEmployee = employeeService.createEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating employee");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(
            @PathVariable Long id,
            @CookieValue("jwt-token") String token
    ) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee currentEmployee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));

            if (!currentEmployee.isAdmin()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("You are not authorized");
            }

            employeeService.deleteEmployee(id);
            return ResponseEntity.noContent().build();

        } catch (EmployeeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting employee");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @CookieValue(value = "jwt-token", required = false) String token,
            @RequestBody UpdateEmployeeRequest request
    ) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing token");
            }

            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee currentEmployee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));

            Employee targetEmployee = employeeRepository.findById(id)
                    .orElseThrow(() -> new EmployeeNotFoundException("id=" + id));

            boolean isAdmin = currentEmployee.isAdmin();
            boolean isSelf = currentEmployee.getId().equals(targetEmployee.getId());

            if (!isAdmin && !isSelf) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("You are not authorized to edit this employee");
            }

            Employee updatedEmployee = employeeService.updateEmployee(targetEmployee, request, isAdmin);

            return ResponseEntity.ok(updatedEmployee);

        } catch (EmployeeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating employee");
        }
    }

}
