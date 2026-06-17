package com.palette.api.dto;

import com.palette.api.model.Stock;

import java.util.List;

public record StockResponse(
        Long id,
        int quantity,
        double price,
        PalletDto pallet,
        CompanyResponse company,
        List<PhotoDto> photos
) {
    public record PalletDto(
            Long id,
            String name,
            String quality,
            String url,
            int length,
            int width,
            int height,
            Integer safeWorkingLoad,
            Double weight,
            PalletSortResponse palletSort
    ) {}

    public record PhotoDto(
            Long id,
            String blobName
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
                        stock.getPallet().getUrl(),
                        stock.getPallet().getLength(),
                        stock.getPallet().getWidth(),
                        stock.getPallet().getHeight(),
                        stock.getPallet().getSafeWorkingLoad(),
                        stock.getPallet().getWeight(),
                        stock.getPallet().getPalletSort() != null
                                ? PalletSortResponse.from(stock.getPallet().getPalletSort())
                                : null
                ),
                stock.getCompany() != null ? CompanyResponse.from(stock.getCompany()) : null,
                stock.getPhotos().stream()
                        .map(p -> new PhotoDto(p.getId(), p.getBlobName()))
                        .toList()
        );
    }
}
