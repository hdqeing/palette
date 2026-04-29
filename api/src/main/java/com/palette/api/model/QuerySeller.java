package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class QuerySeller {

    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    private Query query;
    @ManyToOne
    private Company seller;
    private double sum;
    private boolean isAccepted;
    private boolean isRejected;
}
