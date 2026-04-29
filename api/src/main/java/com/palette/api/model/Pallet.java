package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Pallet {

    @Id
    @GeneratedValue
    private long id;
    @ManyToOne
    private PalletSort palletSort;
    private int boards;
    private int nails;
    private int blocks;
    private int length;
    private int width;
    private int height;
    private String name;
    private int safeWorkingLoad;
    private double weight;
    private String quality;
    private String url;

    public Pallet(PalletSort palletSort, int boards, int nails, int blocks,
                  int length, int width, int height, String name,
                  int safeWorkingLoad, double weight, String quality, String url) {
        this.palletSort = palletSort;
        this.boards = boards;
        this.nails = nails;
        this.blocks = blocks;
        this.length = length;
        this.width = width;
        this.height = height;
        this.name = name;
        this.safeWorkingLoad = safeWorkingLoad;
        this.weight = weight;
        this.quality = quality;
        this.url = url;
    }

}
