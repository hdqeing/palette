package com.palette.api.dto;

import com.palette.api.model.Company;
import com.palette.api.model.Pallet;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class QueryResponseDto {
    private List<Pallet> pallets;
    private List<Integer> quantity;
    private List<Offer> offers;

    @Data
    private class Offer {
        private Company company;
        private List<Double> price;
    }

}