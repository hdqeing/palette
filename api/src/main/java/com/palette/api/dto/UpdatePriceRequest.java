package com.palette.api.dto;

import lombok.Data;

import java.util.Map;

@Data
public class UpdatePriceRequest {
    private Map<Long, Double> prices; // Map of queryPalletId to price
}
