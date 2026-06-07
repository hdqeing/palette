package com.palette.api.dto;

import com.palette.api.model.Stock;

import java.util.List;

public record StockResponse(
        Long id,
        int quantity,
        double price,
        PalletDto pallet,
        List<String> photoUrls
) {
    public record PalletDto(
            Long id,
            String name,
            String quality,
            String url
    ) {}

    public static StockResponse from(Stock stock) {
        return new StockResponse(
                stock.getId(),
                stock.getQuantity(),
                stock.getPrice(),
                new PalletDto(
                        stock.getPallet().getId(),
                        stock.getPallet().getName(),
                        stock.getPallet().getQuality(),
                        stock.getPallet().getUrl()
                ),
                stock.getPhotos().stream()
                        .map(p -> p.getBlobName())
                        .toList()
        );
    }
}