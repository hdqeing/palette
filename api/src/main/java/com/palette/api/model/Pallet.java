package com.palette.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.Map;

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

    @Column(unique = true)
    private String epalCode;

    private String name;

    // Nullable because some EPAL product sheets, especially CP pallets, do not publish these values.
    private Integer safeWorkingLoad;
    private Double weight;

    private String quality;
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean custom;

    @Column(columnDefinition = "TEXT")
    private String materials;

    @Column(columnDefinition = "TEXT")
    private String useCase;

    @Column(columnDefinition = "TEXT")
    private String handling;

    private Boolean ispm15Required;
    private Integer stackingLoad;
    private Double cargoSpaceCubicMeters;
    private String superimposedLoad;
    private String revision;

    @Column(columnDefinition = "TEXT")
    private String sourceUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> componentDetails = new HashMap<>();

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Company owner;

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

    public Pallet(PalletSort palletSort, String epalCode, int boards, int nails, int blocks,
                  int length, int width, int height, String name,
                  Integer safeWorkingLoad, Double weight, String quality, String url,
                  String description, String materials, String useCase, String handling,
                  Boolean ispm15Required, Integer stackingLoad, Double cargoSpaceCubicMeters,
                  String superimposedLoad, String revision, String sourceUrl,
                  Map<String, Object> componentDetails) {
        this.palletSort = palletSort;
        this.epalCode = epalCode;
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
        this.description = description;
        this.materials = materials;
        this.useCase = useCase;
        this.handling = handling;
        this.ispm15Required = ispm15Required;
        this.stackingLoad = stackingLoad;
        this.cargoSpaceCubicMeters = cargoSpaceCubicMeters;
        this.superimposedLoad = superimposedLoad;
        this.revision = revision;
        this.sourceUrl = sourceUrl;
        this.componentDetails = componentDetails == null ? new HashMap<>() : componentDetails;
    }
}
