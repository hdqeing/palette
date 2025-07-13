package com.palette.api.dto;

import java.util.List;

public class CreateQueryRequest {
    private List<Long> sellers;
    private List<ItemQuantity> itemQuantities;

    public List<Long> getSellers() {
        return sellers;
    }

    public void setSellers(List<Long> sellers) {
        this.sellers = sellers;
    }

    public List<ItemQuantity> getItemQuantities() {
        return itemQuantities;
    }

    public void setItemQuantities(List<ItemQuantity> itemQuantities) {
        this.itemQuantities = itemQuantities;
    }


}


