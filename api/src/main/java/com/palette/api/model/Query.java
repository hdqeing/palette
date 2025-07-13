package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Entity
public class Query {

    @Id
    @GeneratedValue
    private Long id;
    private boolean isSellerApproved;
    private boolean isBuyerApproved;
    private Long batchId;
    private ZonedDateTime createdAt;

    @ManyToOne
    private Company buyer;

    @ManyToOne
    private Company seller;



}
