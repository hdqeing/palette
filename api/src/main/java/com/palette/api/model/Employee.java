package com.palette.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    @JsonIgnore
    private String password;
    private String preferredLanguage;
    @JsonIgnore
    private String verificationCode;
    private String telephone;
    private String salutation;
    @JsonIgnore
    private ZonedDateTime expireAt;
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Message> messages;
    private boolean emailNotificationEnabled;
    private String username;
    private boolean isAdmin;

    @ManyToOne
    private Company company;

    public Employee() {
    }

    public Employee(String email, String verificationCode, ZonedDateTime expireAt) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.expireAt = expireAt;
    }
}
