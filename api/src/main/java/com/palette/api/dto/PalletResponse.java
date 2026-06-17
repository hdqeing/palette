package com.palette.api.dto;

import com.palette.api.model.Pallet;

import java.util.Map;

/**
 * Wire-format DTO for {@link Pallet}. Use this anywhere a Pallet would
 * otherwise be serialized to JSON, so we never leak the JPA entity (and its
 * lazy {@code owner}/{@code palletSort} associations) past the controller boundary.
 */
public record PalletResponse(
        Long id,
        PalletSortResponse palletSort,
        int boards,
        int nails,
        int blocks,
        int length,
        int width,
        int height,
        String epalCode,
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
        Map<String, Object> componentDetails,
        Long ownerId
) {
    public static PalletResponse from(Pallet p) {
        return new PalletResponse(
                p.getId(),
                p.getPalletSort() != null ? PalletSortResponse.from(p.getPalletSort()) : null,
                p.getBoards(),
                p.getNails(),
                p.getBlocks(),
                p.getLength(),
                p.getWidth(),
                p.getHeight(),
                p.getEpalCode(),
                p.getName(),
                p.getSafeWorkingLoad(),
                p.getWeight(),
                p.getQuality(),
                p.getUrl(),
                p.getDescription(),
                p.isCustom(),
                p.getMaterials(),
                p.getUseCase(),
                p.getHandling(),
                p.getIspm15Required(),
                p.getStackingLoad(),
                p.getCargoSpaceCubicMeters(),
                p.getSuperimposedLoad(),
                p.getRevision(),
                p.getSourceUrl(),
                p.getComponentDetails(),
                p.getOwner() != null ? p.getOwner().getId() : null
        );
    }
}
