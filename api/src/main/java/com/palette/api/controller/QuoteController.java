package com.palette.api.controller;

import com.palette.api.dto.CreateQuoteRequest;
import com.palette.api.dto.QuoteResponse;
import com.palette.api.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class QuoteController{
    private final QuoteService quoteService;

    @PostMapping("/query/{queryId}/quotes")
    public List<QuoteResponse> createQuote(
            @CookieValue("jwt-token") String token,
            @PathVariable Long queryId,
            @RequestBody CreateQuoteRequest request
    ) {
        return quoteService.createQuote(token, queryId, request).stream()
                .map(QuoteResponse::from)
                .toList();
    }
}
