// dto/SellerQueryPalletResponse.java
package com.palette.api.dto;

import lombok.Data;
import com.palette.api.model.Pallet;

@Data
public class SellerQueryPalletResponse {
    private Long queryPalletId;
    private Pallet pallet;
    private Integer quantity;
    private Double quotedPrice; // null if seller hasn't quoted this pallet yet
}