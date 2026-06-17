package com.palette.api.dto;

import lombok.Data;

@Data
public class QueryPalletDetailsResponse {
    private Long queryPalletId;
    private PalletResponse pallet;
    private Integer quantity;
}
