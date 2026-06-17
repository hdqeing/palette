package com.palette.api.dto;

import lombok.Data;

@Data
public class BuyerQueryPalletResponse {
    private PalletResponse pallet;
    private Integer quantity;
}
