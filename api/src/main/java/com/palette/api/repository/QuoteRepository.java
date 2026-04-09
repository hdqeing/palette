package com.palette.api.repository;

import com.palette.api.model.Company;
import com.palette.api.model.QueryPallet;
import com.palette.api.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByQueryPalletAndSellerAndIsLatestTrue(QueryPallet queryPallet, Company seller);
}
