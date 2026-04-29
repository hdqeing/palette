package com.palette.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateCartRequest {
    private List<UpdateCartItemRequest> items;
}