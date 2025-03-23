package com.palette.api.controller;

import com.palette.api.model.Offer;
import com.palette.api.repository.OfferRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Tag(name = "Offer Controller", description = "APIs related to offer")
public class OfferController {

    private final OfferRepository repository;

    public OfferController(OfferRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/offers")
    @Operation(summary = "Get all offers")
    List<Offer> all() {
        return repository.findAll();
    }

    @GetMapping("/offers/query/{queryId}")
    @Operation(summary = "Get offers that belongs to an query")
    List<Offer> getOffersByQuery(@PathVariable Long queryId) {
        return repository.findByQueryId(queryId);
    }

    @PostMapping("/offer")
    @Operation(summary = "Create a new offer")
    Offer newOffer(@RequestBody Offer newOffer) {
        return repository.save(newOffer);
    }

    @GetMapping("/offer/{id}")
    @Operation(summary = "Get Offer by id")
    Optional<Offer> one(@PathVariable Long id) {
        return repository.findById(id);
    }


}
