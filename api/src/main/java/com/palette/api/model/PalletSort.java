package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class PalletSort {
    @Id
    @GeneratedValue
    private long id;
    private String name;
    private double length;
    private double width;
    private double height;

    @ManyToOne
    @JsonIgnore
    private PalletCategory palletCategory;

    @OneToMany
    @JsonIgnore
    private List<Pallet> pallets;

    public PalletSort() {
    }

    public PalletSort(String name, double length, double width, double height, PalletCategory palletCategory) {
        this.name = name;
        this.length = length;
        this.width = width;
        this.height = height;
        this.palletCategory = palletCategory;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public List<Pallet> getPallets() {
        return pallets;
    }

    public void setPallets(List<Pallet> pallets) {
        this.pallets = pallets;
    }

    public PalletCategory getPalletCategory() {
        return palletCategory;
    }

    public void setPalletCategory(PalletCategory palletCategory) {
        this.palletCategory = palletCategory;
    }
}
