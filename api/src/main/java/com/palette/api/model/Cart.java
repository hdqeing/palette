package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Data
@Entity
public class Cart {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Company owner;

    @ManyToOne
    private Pallet pallet;

    private Integer quantity;

}
