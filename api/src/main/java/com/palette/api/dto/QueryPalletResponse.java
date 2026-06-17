package com.palette.api.dto;

import com.palette.api.model.QueryPallet;

public record QueryPalletResponse(
        Long id,
        Long queryId,
        Long palletId,
        String palletName,
        Integer quantity
) {
    public static QueryPalletResponse from(QueryPallet qp) {
        return new QueryPalletResponse(
                qp.getId(),
                qp.getQuery() != null ? qp.getQuery().getId() : null,
                qp.getPallet() != null ? qp.getPallet().getId() : null,
                qp.getPallet() != null ? qp.getPallet().getName() : null,
                qp.getQuantity()
        );
    }
}
