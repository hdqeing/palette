package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonBackReference
    private Employee receiver;

    private String body;

    private boolean isRead;
    private String emailState;

}
