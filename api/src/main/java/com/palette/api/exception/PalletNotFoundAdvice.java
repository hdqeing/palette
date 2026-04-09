package com.palette.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class PalletNotFoundAdvice {
    @ExceptionHandler(PalletNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String palletNotFoundHandler(PalletNotFoundException ex){
        return ex.getMessage();
    }
}
