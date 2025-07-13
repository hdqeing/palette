package com.palette.api.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class QueryResponseDto {
    private Long id;
    private boolean isSellerApproved;
    private boolean isBuyerApproved;
    private Long batchId;
    private ZonedDateTime createdAt;
    private List<QueryItemDto> items;

    @Data
    public static class QueryItemDto {
        private Long palletId;
        private String palletName; // assuming Pallet has a name field
        private Integer quantity;
        private Double price;
    }
}