package com.palette.api.repository;

import com.palette.api.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByQueryId(Long queryId);
}
