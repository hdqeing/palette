package com.palette.api.dto;

import com.palette.api.model.Quote;

public record QuoteResponse(
        Long id,
        Long queryPalletId,
        Long sellerId,
        String sellerTitle,
        double price,
        Boolean isLatest
) {
    public static QuoteResponse from(Quote quote) {
        return new QuoteResponse(
                quote.getId(),
                quote.getQueryPallet() != null ? quote.getQueryPallet().getId() : null,
                quote.getSeller() != null ? quote.getSeller().getId() : null,
                quote.getSeller() != null ? quote.getSeller().getTitle() : null,
                quote.getPrice(),
                quote.getIsLatest()
        );
    }
}
