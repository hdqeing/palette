package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class Query {

    @Id
    @GeneratedValue
    private Long id;
    private String state;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "query")
    @JsonManagedReference
    private List<QueryPallet> pallets;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<QueryPallet> getPallets() {
        return pallets;
    }

    public void setPallets(List<QueryPallet> pallets) {
        this.pallets = pallets;
    }
}
