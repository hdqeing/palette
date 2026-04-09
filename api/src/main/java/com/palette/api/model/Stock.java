package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Stock {
    @Id
    @GeneratedValue
    private Long id;
    private int quantity;
    private double price;

    @ManyToOne
    private Company company;
    @ManyToOne
    private Pallet pallet;
    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Photo> photos = new ArrayList<>();

}
