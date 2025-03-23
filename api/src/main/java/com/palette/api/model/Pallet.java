package com.palette.api.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Pallet {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private double length;
    private double width;
    private double height;

    @OneToMany
    private List<QueryPallet> queryPallet;

    @OneToMany
    private List<OfferPallet> offerPallet;

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

    public List<QueryPallet> getQueryPallet() {
        return queryPallet;
    }

    public void setQueryPallet(List<QueryPallet> queryPallet) {
        this.queryPallet = queryPallet;
    }

    public List<OfferPallet> getOfferPallet() {
        return offerPallet;
    }

    public void setOfferPallet(List<OfferPallet> offerPallet) {
        this.offerPallet = offerPallet;
    }
}
