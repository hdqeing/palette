package com.palette.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = "orders") // "order" is a reserved SQL keyword
public class Order {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "query_id", unique = true)
    private Query query;

    @ManyToOne
    private Company seller;

    @ManyToOne
    private Company buyer;

    private double totalPrice;

    private ZonedDateTime createdAt;
    private ZonedDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String deliveryAddress;
}