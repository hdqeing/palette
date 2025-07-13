package com.palette.api.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class SellerQueryResponseDto {
    private Long id;
    private boolean isSellerApproved;
    private boolean isBuyerApproved;
    private Long batchId;
    private ZonedDateTime createdAt;
    private BuyerInfoDto buyer;
    private List<QueryItemDetailDto> items;

    @Data
    public static class BuyerInfoDto {
        private Long id;
        private String name;
        private String email;
        private String address;
        // Add other buyer fields you want to include
    }

    @Data
    public static class QueryItemDetailDto {
        private Long palletId;
        private String palletQuality;
        private String palletUrl;
        private PalletSortDto palletSort;
        private Integer quantity;
        private Double price;
    }

    @Data
    public static class PalletSortDto {
        private Long id;
        private String name;
        private double length;
        private double width;
        private double height;
    }
}