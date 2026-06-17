package com.palette.api.dto;

import com.palette.api.model.PalletSort;

public record PalletSortResponse(
        Long id,
        String name,
        String description
) {
    public static PalletSortResponse from(PalletSort sort) {
        return new PalletSortResponse(sort.getId(), sort.getName(), sort.getDescription());
    }
}
