package com.palette.api.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
public class BuyerQueryResponse {
    private Long id;
    private ZonedDateTime deadline;
    private Boolean isClosed;
    private List<CompanyRefDto> sellers;
    private List<BuyerQueryPalletResponse> pallets;
}
