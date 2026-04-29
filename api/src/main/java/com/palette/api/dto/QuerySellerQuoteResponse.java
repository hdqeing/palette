package com.palette.api.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class QuerySellerQuoteResponse {
    private Long queryPalletId;
    private Long palletId;
    private Double price;
    private ZonedDateTime deadline;
    private Boolean isLatest;
}