package com.palette.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "palette")
public class Palette {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private Integer length;

    private Integer width;

    private Integer height;

    private String material;

    private String state;

    private Boolean isStandard;

    public Palette() {
    }

    public Palette(Long id, String name, Integer length, Integer width, Integer height, String material, String state, Boolean isStandard) {
        this.id = id;
        this.name = name;
        this.length = length;
        this.width = width;
        this.height = height;
        this.material = material;
        this.state = state;
        this.isStandard = isStandard;
    }

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

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Boolean getStandard() {
        return isStandard;
    }

    public void setStandard(Boolean standard) {
        isStandard = standard;
    }
}
