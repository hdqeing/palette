package com.palette.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PalletSort {
    @Id
    @GeneratedValue
    private long id;
    private String name;

    public PalletSort(String palletName) {
        this.name=palletName;
    }

}
