package com.palette.api.dto;

import java.util.Map;

/**
 * Request DTO for creating/updating a {@link com.palette.api.model.Pallet}.
 * The frontend sends the pallet sort as a nested {@code { id }} reference
 * (matching how it reads {@code pallet.palletSort.id} back), so we mirror
 * that shape here rather than a flat {@code palletSortId}.
 */
public record PalletRequest(
        PalletSortRef palletSort,
        String epalCode,
        int boards,
        int nails,
        int blocks,
        int length,
        int width,
        int height,
        String name,
        Integer safeWorkingLoad,
        Double weight,
        String quality,
        String url,
        String description,
        boolean custom,
        String materials,
        String useCase,
        String handling,
        Boolean ispm15Required,
        Integer stackingLoad,
        Double cargoSpaceCubicMeters,
        String superimposedLoad,
        String revision,
        String sourceUrl,
        Map<String, Object> componentDetails
) {
    public record PalletSortRef(Long id) {}

    public Long palletSortId() {
        return palletSort != null ? palletSort.id() : null;
    }
}
