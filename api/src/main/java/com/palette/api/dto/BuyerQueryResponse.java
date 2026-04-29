package com.palette.api.dto;

import com.palette.api.model.Company;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
public class BuyerQueryResponse {
    private Long id;
    private ZonedDateTime deadline;
    private Boolean isClosed;
    private List<Company> sellers;
    private List<BuyerQueryPalletResponse> pallets;
}