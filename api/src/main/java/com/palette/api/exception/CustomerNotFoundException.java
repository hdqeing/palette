package com.palette.api.exception;

public class CustomerNotFoundException extends RuntimeException{
    public CustomerNotFoundException(String email) {
        super("Could not find customer with email " + email);
    }
}
