package com.palette.api.dto;

import com.palette.api.model.Cart;

/**
 * Wire-format DTO for {@link Cart}. The frontend's {@code CartEntity} type
 * expects a nested {@code pallet} object (matching {@code Pallet}), not a
 * flattened shape, so we mirror that here.
 */
public record CartItemResponse(
        Long id,
        PalletResponse pallet,
        Integer quantity
) {
    public static CartItemResponse from(Cart cart) {
        return new CartItemResponse(
                cart.getId(),
                cart.getPallet() != null ? PalletResponse.from(cart.getPallet()) : null,
                cart.getQuantity()
        );
    }
}
