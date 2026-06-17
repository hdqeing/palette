// dto/SellerQueryPalletResponse.java
package com.palette.api.dto;

import lombok.Data;

@Data
public class SellerQueryPalletResponse {
    private Long queryPalletId;
    private PalletResponse pallet;
    private Integer quantity;
    private Double quotedPrice; // null if seller hasn't quoted this pallet yet
}
