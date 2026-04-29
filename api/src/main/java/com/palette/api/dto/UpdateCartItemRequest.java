package com.palette.api.dto;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Long palletId;
    private Integer quantity;
}