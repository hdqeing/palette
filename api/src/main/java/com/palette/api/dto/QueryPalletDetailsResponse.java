package com.palette.api.dto;

import com.palette.api.model.Pallet;
import lombok.Data;

@Data
public class QueryPalletDetailsResponse {
    private Long queryPalletId;
    private Pallet pallet;
    private Integer quantity;
}