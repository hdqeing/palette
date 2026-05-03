// dto/SellerQueryResponse.java
package com.palette.api.dto;

import lombok.Data;
import com.palette.api.model.Company;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class SellerQueryResponse {
    private Long queryId;
    private ZonedDateTime deadline;
    private Boolean isClosed;
    private boolean isDeliveryRequest;
    private Company buyer;
    private List<SellerQueryPalletResponse> pallets;
    private boolean accepted;
    private boolean rejected;
    private double sum;
}