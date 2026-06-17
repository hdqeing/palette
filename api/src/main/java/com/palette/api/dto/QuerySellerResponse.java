package com.palette.api.dto;

import com.palette.api.model.QuerySeller;

public record QuerySellerResponse(
        Long id,
        Long queryId,
        Long sellerId,
        String sellerTitle,
        double sum,
        boolean isAccepted,
        boolean isRejected
) {
    public static QuerySellerResponse from(QuerySeller qs) {
        return new QuerySellerResponse(
                qs.getId(),
                qs.getQuery() != null ? qs.getQuery().getId() : null,
                qs.getSeller() != null ? qs.getSeller().getId() : null,
                qs.getSeller() != null ? qs.getSeller().getTitle() : null,
                qs.getSum(),
                qs.isAccepted(),
                qs.isRejected()
        );
    }
}
