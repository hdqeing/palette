package com.palette.api.dto;

import lombok.Data;

@Data
public class CreateCompanyRequest {
    private String title;
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String homepage;
    private String vat;
    private boolean isSeller = false;
    private boolean isShipping = false;
    private boolean isGermanyPickUp = false;
    private boolean isEuPickUp = false;
    private boolean isGermanyDeliver = false;
    private boolean isEuDeliver = false;
}