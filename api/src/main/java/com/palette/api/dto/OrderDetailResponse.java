package com.palette.api.dto;

import com.palette.api.model.*;

import java.time.ZonedDateTime;
import java.util.List;

public record OrderDetailResponse(
        Long id,
        CompanyDto buyer,
        List<OrderItemDto> items,
        double totalPrice,
        String status,
        ZonedDateTime createdAt,
        ZonedDateTime deliveryDate,
        String deliveryAddress,
        Long queryId
) {
    public record CompanyDto(
            Long id,
            String title,
            String street,
            String houseNumber,
            String postalCode,
            String city,
            String homepage,
            String vat,
            boolean verified
    ) {
        public static CompanyDto from(Company c) {
            return new CompanyDto(
                    c.getId(), c.getTitle(), c.getStreet(), c.getHouseNumber(),
                    c.getPostalCode(), c.getCity(), c.getHomepage(), c.getVat(),
                    c.isVerified()
            );
        }
    }

    public record OrderItemDto(
            Pallet pallet,
            int quantity,
            double pricePerItem
    ) {}

    public static OrderDetailResponse from(Order order, List<OrderItemDto> items) {
        return new OrderDetailResponse(
                order.getId(),
                CompanyDto.from(order.getBuyer()),
                items,
                order.getTotalPrice(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getDeliveryDate(),
                order.getDeliveryAddress(),
                order.getQuery() != null ? order.getQuery().getId() : null
        );
    }
}