package com.palette.api.controller;

import com.palette.api.dto.CreateEmployeeRequest;
import com.palette.api.dto.EmployeeDto;
import com.palette.api.dto.UpdateEmployeeRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Employee;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only employee endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin/employee")
public class AdminEmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> dtos = employeeRepository.findAll()
                .stream()
                .map(EmployeeDto::from)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody CreateEmployeeRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Employee with this email already exists");
        }
        Employee saved = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(EmployeeDto.from(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @RequestBody UpdateEmployeeRequest request
    ) {
        Employee target = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("id=" + id));
        Employee updated = employeeService.updateEmployee(target, request);
        return ResponseEntity.ok(EmployeeDto.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}