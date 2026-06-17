package com.palette.api.dto;

import com.palette.api.model.Photo;

public record PhotoResponse(
        Long id,
        String blobName,
        Long ownerId
) {
    public static PhotoResponse from(Photo photo) {
        return new PhotoResponse(
                photo.getId(),
                photo.getBlobName(),
                photo.getOwner() != null ? photo.getOwner().getId() : null
        );
    }
}
