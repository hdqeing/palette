package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Pallet {

    @Id
    @GeneratedValue
    private long id;
    @ManyToOne
    @JsonIgnore
    private PalletSort sort;
    private String quality;
    private String url;

    @OneToMany
    @JsonIgnore
    private List<QueryPallet> queryPallet;

    @OneToMany
    @JsonIgnore
    private List<OfferPallet> offerPallet;

    public Pallet() {
    }


    public Pallet(PalletSort sort, String quality, String url) {
        this.sort = sort;
        this.quality = quality;
        this.url = url;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public PalletSort getSort() {
        return sort;
    }

    public void setSort(PalletSort sort) {
        this.sort = sort;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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
