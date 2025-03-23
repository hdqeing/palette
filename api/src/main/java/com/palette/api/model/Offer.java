package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Offer {

    @Id
    @GeneratedValue
    private Long id;

    public List<OfferPallet> getOfferPallets() {
        return offerPallets;
    }

    public void setOfferPallets(List<OfferPallet> offerPallets) {
        this.offerPallets = offerPallets;
    }

    @OneToMany(mappedBy = "offer")
    private List<OfferPallet> offerPallets;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @ManyToOne
    @JoinColumn(name = "query_id")
    @JsonBackReference
    private Query query;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public Query getQuery() {
        return query;
    }

    public void setQuery(Query query) {
        this.query = query;
    }
}
