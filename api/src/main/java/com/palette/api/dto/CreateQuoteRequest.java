package com.palette.api.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
public class CreateQuoteRequest {
    private List<PalletQuote> quotes;

    @Data
    public static class PalletQuote {
        private Long palletId;
        private double price;
    }
}
