package com.palette.api.exception;

public class PalletNotFoundException extends RuntimeException {
    public PalletNotFoundException(Long id) {
        super("Could not find pallet " + id);
    }
}
