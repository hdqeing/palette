package com.palette.api.repository;

import com.palette.api.model.Company;
import com.palette.api.model.QueryPallet;
import com.palette.api.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByQueryPalletAndSellerAndIsLatestTrue(QueryPallet queryPallet, Company seller);
    List<Quote> findByQueryPalletQueryIdAndIsLatestTrue(Long queryId);
    List<Quote> findByQueryPalletQueryIdAndSellerIdAndIsLatestTrue(
            Long queryId,
            Long sellerId
    );
    Optional<Quote> findByQueryPalletIdAndSellerId(Long queryPalletId, Long sellerId);


}
