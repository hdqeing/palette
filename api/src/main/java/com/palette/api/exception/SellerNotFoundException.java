package com.palette.api.exception;

public class SellerNotFoundException extends RuntimeException{
    public SellerNotFoundException(String email) {
        super("Could not find Seller with email" + email);
    }
}
