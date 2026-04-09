package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Photo {
    @Id
    @GeneratedValue
    private Long id;
    private String blobName;

    @ManyToOne
    @JsonBackReference
    private Stock stock;

    @ManyToOne
    @JsonManagedReference
    private Company owner;

    public Photo(String blobName) {
        this.blobName = blobName;
    }
}
