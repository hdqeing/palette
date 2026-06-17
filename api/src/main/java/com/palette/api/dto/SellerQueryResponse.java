// dto/SellerQueryResponse.java
package com.palette.api.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

@Data
public class SellerQueryResponse {
    private Long queryId;
    private ZonedDateTime deadline;
    private Boolean isClosed;
    private boolean isDeliveryRequest;
    private CompanyRefDto buyer;
    private List<SellerQueryPalletResponse> pallets;
    private boolean accepted;
    private boolean rejected;
    private double sum;
}
