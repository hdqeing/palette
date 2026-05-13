package com.palette.api.dto;

import java.time.ZonedDateTime;

public record CreateOrderRequest(
        Long queryId,
        Long sellerId,
        Long buyerId,
        double totalPrice,
        ZonedDateTime deliveryDate,
        String deliveryAddress
) {}