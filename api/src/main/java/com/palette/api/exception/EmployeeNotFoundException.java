package com.palette.api.exception;

public class EmployeeNotFoundException extends RuntimeException{
    public EmployeeNotFoundException(String email) {
        super("Could not find Employee with email " + email);
    }
}
