package com.palette.api.dto;

import com.palette.api.model.Company;

/**
 * Wire-format DTO for {@link Company}. Use this anywhere a Company would
 * otherwise be serialized to JSON, so we never leak the JPA entity (and its
 * lazy {@code employees}/{@code photos} associations) past the controller boundary.
 *
 * Field names intentionally match the frontend's {@code Company} type (no "is"
 * prefix) — Jackson serializes record components verbatim, unlike JavaBean
 * {@code isXxx()} getters, which it strips to {@code xxx}.
 */
public record CompanyResponse(
        Long id,
        String title,
        String street,
        String houseNumber,
        String postalCode,
        String city,
        String homepage,
        String vat,
        boolean verified,
        boolean seller,
        boolean shipping,
        boolean germanyPickUp,
        boolean euPickUp,
        boolean germanyDeliver,
        boolean euDeliver
) {
    public static CompanyResponse from(Company c) {
        return new CompanyResponse(
                c.getId(),
                c.getTitle(),
                c.getStreet(),
                c.getHouseNumber(),
                c.getPostalCode(),
                c.getCity(),
                c.getHomepage(),
                c.getVat(),
                c.isVerified(),
                c.isSeller(),
                c.isShipping(),
                c.isGermanyPickUp(),
                c.isEuPickUp(),
                c.isGermanyDeliver(),
                c.isEuDeliver()
        );
    }
}
