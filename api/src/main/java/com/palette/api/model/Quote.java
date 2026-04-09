package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Data
@Entity
public class Quote {

    @Id
    @GeneratedValue
    private Long id;
    private ZonedDateTime deadline;

    @ManyToOne
    private QueryPallet queryPallet;

    @ManyToOne
    private Company seller;
    private double price;
    private Boolean isLatest;
}
