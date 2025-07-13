package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Pallet {

    @Id
    @GeneratedValue
    private long id;
    @ManyToOne
    private PalletSort sort;
    private String quality;
    private String url;


    public Pallet() {
    }


    public Pallet(PalletSort sort, String quality, String url) {
        this.sort = sort;
        this.quality = quality;
        this.url = url;
    }

}
