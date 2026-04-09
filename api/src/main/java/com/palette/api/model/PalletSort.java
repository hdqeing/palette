package com.palette.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class PalletSort {
    @Id
    @GeneratedValue
    private long id;
    private String name;
    private double length;
    private double width;
    private double height;
    private boolean isPrivate;
    @ManyToOne
    private Company owner;

    public PalletSort() {
    }

    public PalletSort(String name, double length, double width, double height) {
        this.name = name;
        this.length = length;
        this.width = width;
        this.height = height;
    }

}
