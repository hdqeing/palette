package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.lang.reflect.Array;
import java.util.List;

@Data
@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String homepage;
    private String vat;
    private boolean verified;
    private boolean isSeller = false;
    private boolean isShipping = false;
    private boolean isGermanyPickUp = false;
    private boolean isEuPickUp = false;
    private boolean isGermanyDeliver = false;
    private boolean isEuDeliver = false;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Photo> photos;
}
