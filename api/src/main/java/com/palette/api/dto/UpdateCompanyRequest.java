package com.palette.api.dto;

import lombok.Data;

@Data
public class UpdateCompanyRequest {
    private String title;
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String homepage;
    private String vat;
    private boolean isSeller;
    private boolean isShipping;
    private boolean isGermanyPickUp;
    private boolean isEuPickUp;
    private boolean isGermanyDeliver;
    private boolean isEuDeliver;
}