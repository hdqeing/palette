package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class QueryPallet {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Pallet pallet;

    @ManyToOne
    private Query query;

    private Integer quantity;
    private Double price;
}
