package com.palette.api.dto;

public class ItemQuantity {
    private Long palletId;
    private Integer quantity;

    public Long getPalletId() {
        return palletId;
    }

    public void setPalletId(Long palletId) {
        this.palletId = palletId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
