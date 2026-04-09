// PalletAdvertiseResponse.java
package com.palette.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class PalletAdvertiseResponse {
    private String id;
    private String palletName;
    private String palletState;
    private String description;
    private List<String> photoUrls;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Constructors
    public PalletAdvertiseResponse() {}

    public PalletAdvertiseResponse(String id, String palletName, String palletState,
                                   String description, List<String> photoUrls, LocalDateTime createdAt) {
        this.id = id;
        this.palletName = palletName;
        this.palletState = palletState;
        this.description = description;
        this.photoUrls = photoUrls;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPalletName() {
        return palletName;
    }

    public void setPalletName(String palletName) {
        this.palletName = palletName;
    }

    public String getPalletState() {
        return palletState;
    }

    public void setPalletState(String palletState) {
        this.palletState = palletState;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getPhotoUrls() {
        return photoUrls;
    }

    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

