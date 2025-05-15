package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class PalletCategory {
    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public PalletCategory(String name) {
        this.name = name;
    }

    public PalletCategory() {
    }

    @OneToMany
    @JsonIgnore
    private List<PalletSort> palletSorts;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<PalletSort> getPalletSorts() {
        return palletSorts;
    }

    public void setPalletSorts(List<PalletSort> palletSorts) {
        this.palletSorts = palletSorts;
    }
}
