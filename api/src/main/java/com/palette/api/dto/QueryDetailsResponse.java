package com.palette.api.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
public class QueryDetailsResponse {
    private Long id;
    private ZonedDateTime deadline;
    private Boolean isClosed;
    private QueryCompanyResponse buyer;
    private List<QueryPalletDetailsResponse> pallets;
    private List<QuerySellerDetailsResponse> sellers;
}