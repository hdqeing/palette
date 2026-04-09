package com.palette.api.repository;

import com.palette.api.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryPalletPriceRepository extends JpaRepository<Quote, Long> {
}