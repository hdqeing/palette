package com.palette.api.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class CreateQuoteRequest {
    private Long queryPalletId;
    private Double price;
}
