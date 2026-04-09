// PalletAdvertiseRequest.java (if you want to use it later)
package com.palette.api.dto;

import org.springframework.web.multipart.MultipartFile;

public class PalletAdvertiseRequest {
    private String palletName;
    private String palletState;
    private String description;
    private MultipartFile[] photos;

    // Constructors
    public PalletAdvertiseRequest() {}

    public PalletAdvertiseRequest(String palletName, String palletState, String description, MultipartFile[] photos) {
        this.palletName = palletName;
        this.palletState = palletState;
        this.description = description;
        this.photos = photos;
    }

    // Getters and Setters
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

    public MultipartFile[] getPhotos() {
        return photos;
    }

    public void setPhotos(MultipartFile[] photos) {
        this.photos = photos;
    }
}