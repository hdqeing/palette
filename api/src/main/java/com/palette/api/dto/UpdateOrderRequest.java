package com.palette.api.dto;

import com.palette.api.model.OrderStatus;

import java.time.ZonedDateTime;

public record UpdateOrderRequest(
        OrderStatus status,
        ZonedDateTime deliveryDate,
        String deliveryAddress,
        Double totalPrice   // wrapper type so null means "don't update"
) {}