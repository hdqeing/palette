package com.palette.api.dto;

import com.palette.api.model.Query;

import java.time.ZonedDateTime;

public record QueryResponse(
        Long id,
        ZonedDateTime deadline,
        boolean isDeliveryRequest,
        Boolean isClosed,
        Long buyerId,
        String buyerTitle
) {
    public static QueryResponse from(Query query) {
        return new QueryResponse(
                query.getId(),
                query.getDeadline(),
                query.isDeliveryRequest(),
                query.getIsClosed(),
                query.getBuyer() != null ? query.getBuyer().getId() : null,
                query.getBuyer() != null ? query.getBuyer().getTitle() : null
        );
    }
}
