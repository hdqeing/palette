package com.palette.api.controller;

import com.palette.api.dto.CreateQuoteRequest;
import com.palette.api.model.Quote;
import com.palette.api.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class QuoteController{
    private final QuoteService quoteService;

    @PostMapping("/quotes")
    public Quote createQuote(@CookieValue("jwt-token") String token, @RequestBody CreateQuoteRequest request){
        return quoteService.createQuote(token, request);
    }
}
