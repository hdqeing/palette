package com.palette.api.dto;

import com.palette.api.model.Order;
import com.palette.api.model.OrderStatus;

import java.time.ZonedDateTime;

/**
 * Wire-format DTO for {@link Order}. Use this anywhere an Order
 * would otherwise be serialized to JSON, so we never leak the JPA
 * entity (and its lazy associations) past the controller boundary.
 */
public record OrderResponse(
        Long id,
        Long queryId,
        Long sellerId,
        String sellerTitle,
        Long buyerId,
        String buyerTitle,
        double totalPrice,
        OrderStatus status,
        ZonedDateTime createdAt,
        ZonedDateTime deliveryDate,
        String deliveryAddress
) {
    public static OrderResponse from(Order o) {
        return new OrderResponse(
                o.getId(),
                o.getQuery() != null ? o.getQuery().getId() : null,
                o.getSeller() != null ? o.getSeller().getId() : null,
                o.getSeller() != null ? o.getSeller().getTitle() : null,
                o.getBuyer() != null ? o.getBuyer().getId() : null,
                o.getBuyer() != null ? o.getBuyer().getTitle() : null,
                o.getTotalPrice(),
                o.getStatus(),
                o.getCreatedAt(),
                o.getDeliveryDate(),
                o.getDeliveryAddress()
        );
    }
}
