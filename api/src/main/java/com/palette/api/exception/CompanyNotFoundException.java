package com.palette.api.exception;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(Long companyId) {
        super("Could not find company "+companyId);
    }
}
