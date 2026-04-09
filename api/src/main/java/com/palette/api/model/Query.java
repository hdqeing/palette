package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;

@Data
@Entity
public class Query {

    @Id
    @GeneratedValue
    private Long id;
    private ZonedDateTime deadline;

    @ManyToOne
    private Company buyer;
    private Boolean isClosed;
}
