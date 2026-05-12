package com.palette.api.controller;

import com.palette.api.dto.CreateCompanyRequest;
import com.palette.api.dto.UpdateCompanyRequest;
import com.palette.api.exception.CompanyNotFoundException;
import com.palette.api.model.Company;
import com.palette.api.repository.CompanyRepository;
import com.palette.api.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only company endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin/companies")
public class AdminCompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody CreateCompanyRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Company title is required");
        }

        Company saved = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable Long id,
            @RequestBody UpdateCompanyRequest request
    ) {
        Company target = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        Company updated = companyService.updateCompany(target, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        if (!companyRepository.existsById(id)) {
            throw new CompanyNotFoundException(id);
        }
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}