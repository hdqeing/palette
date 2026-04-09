package com.palette.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateQueryRequest {
    private List<Long> sellers;
    private List<ItemQuantity> itemQuantities;

}