package com.palette.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuerySellerDetailsResponse {
    private Long sellerId;
    private String sellerTitle;
    private List<QuerySellerQuoteResponse> quotes;
    private double sum;
    private boolean isAccepted;
    private boolean isRejected;
}