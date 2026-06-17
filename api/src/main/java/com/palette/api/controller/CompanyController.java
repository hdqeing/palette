package com.palette.api.controller;

import com.palette.api.dto.CompanyResponse;
import com.palette.api.dto.CreateCompanyRequest;
import com.palette.api.dto.StockResponse;
import com.palette.api.dto.UpdateCompanyRequest;
import com.palette.api.dto.VerifyCompanyRequest;
import com.palette.api.model.Company;
import com.palette.api.repository.CompanyRepository;
import com.palette.api.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private StockRepository stockRepository;


    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        List<CompanyResponse> companies = companyRepository.findAll().stream()
                .map(CompanyResponse::from)
                .toList();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(CompanyResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stocks")
    public ResponseEntity<List<StockResponse>> getStocksByCompany(@PathVariable Long id) {
        List<StockResponse> stocks = stockRepository.findByCompanyId(id).stream()
                .map(StockResponse::from)
                .toList();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/sellers")
    public ResponseEntity<List<CompanyResponse>> getSellers() {
        List<CompanyResponse> sellers = companyRepository.findByIsSellerTrue().stream()
                .map(CompanyResponse::from)
                .toList();
        return ResponseEntity.ok(sellers);
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(@RequestBody CreateCompanyRequest request) {
        Company company = new Company();
        company.setTitle(request.getTitle());
        company.setStreet(request.getStreet());
        company.setHouseNumber(request.getHouseNumber());
        company.setPostalCode(request.getPostalCode());
        company.setCity(request.getCity());
        company.setHomepage(request.getHomepage());
        company.setVat(request.getVat());
        company.setSeller(request.isSeller());
        company.setShipping(request.isShipping());
        company.setGermanyPickUp(request.isGermanyPickUp());
        company.setEuPickUp(request.isEuPickUp());
        company.setGermanyDeliver(request.isGermanyDeliver());
        company.setEuDeliver(request.isEuDeliver());

        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(CompanyResponse.from(savedCompany));
    }


    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long id,
            @RequestBody UpdateCompanyRequest request
    ) {
        return companyRepository.findById(id)
                .map(existingCompany -> {
                    existingCompany.setTitle(request.getTitle());
                    existingCompany.setStreet(request.getStreet());
                    existingCompany.setHouseNumber(request.getHouseNumber());
                    existingCompany.setPostalCode(request.getPostalCode());
                    existingCompany.setCity(request.getCity());
                    existingCompany.setHomepage(request.getHomepage());
                    existingCompany.setVat(request.getVat());
                    existingCompany.setSeller(request.isSeller());
                    existingCompany.setShipping(request.isShipping());
                    existingCompany.setGermanyPickUp(request.isGermanyPickUp());
                    existingCompany.setEuPickUp(request.isEuPickUp());
                    existingCompany.setGermanyDeliver(request.isGermanyDeliver());
                    existingCompany.setEuDeliver(request.isEuDeliver());

                    Company updatedCompany = companyRepository.save(existingCompany);
                    return ResponseEntity.ok(CompanyResponse.from(updatedCompany));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        companyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}