package com.palette.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdatePriceResponse {
    private boolean success;
    private String message;
    private List<UpdatedItem> updatedItems;

    @Data
    public static class UpdatedItem {
        private Long queryPalletId;
        private Double oldPrice;
        private Double newPrice;

        public UpdatedItem(Long queryPalletId, Double oldPrice, Double newPrice) {
            this.queryPalletId = queryPalletId;
            this.oldPrice = oldPrice;
            this.newPrice = newPrice;
        }
    }
}
