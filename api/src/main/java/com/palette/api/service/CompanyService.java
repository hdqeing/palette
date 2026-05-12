package com.palette.api.service;

import com.palette.api.dto.CreateCompanyRequest;
import com.palette.api.dto.UpdateCompanyRequest;
import com.palette.api.exception.CompanyNotFoundException;
import com.palette.api.model.Company;
import com.palette.api.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Company createCompany(CreateCompanyRequest request) {
        Company company = new Company();
        applyRequest(company, request.getTitle(), request.getStreet(),
                request.getHouseNumber(), request.getPostalCode(), request.getCity(),
                request.getHomepage(), request.getVat(), request.isSeller(),
                request.isShipping(), request.isGermanyPickUp(), request.isGermanyDeliver(),
                request.isEuPickUp(), request.isEuDeliver());
        company.setVerified(false); // new companies start unverified
        return companyRepository.save(company);
    }

    public Company updateCompany(Company company, UpdateCompanyRequest request) {
        applyRequest(company, request.getTitle(), request.getStreet(),
                request.getHouseNumber(), request.getPostalCode(), request.getCity(),
                request.getHomepage(), request.getVat(), request.isSeller(),
                request.isShipping(), request.isGermanyPickUp(), request.isGermanyDeliver(),
                request.isEuPickUp(), request.isEuDeliver());
        return companyRepository.save(company);
    }

    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));
        companyRepository.delete(company);
    }

    private void applyRequest(Company company, String title, String street,
                              String houseNumber, String postalCode, String city,
                              String homepage, String vat, boolean seller,
                              boolean shipping, boolean germanyPickUp, boolean germanyDeliver,
                              boolean euPickUp, boolean euDeliver) {
        company.setTitle(title);
        company.setStreet(street);
        company.setHouseNumber(houseNumber);
        company.setPostalCode(postalCode);
        company.setCity(city);
        company.setHomepage(homepage);
        company.setVat(vat);
        company.setSeller(seller);
        company.setShipping(shipping);
        company.setGermanyPickUp(germanyPickUp);
        company.setGermanyDeliver(germanyDeliver);
        company.setEuPickUp(euPickUp);
        company.setEuDeliver(euDeliver);
    }
}