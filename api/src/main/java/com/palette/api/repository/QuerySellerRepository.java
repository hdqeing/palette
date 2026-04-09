package com.palette.api.repository;

import com.palette.api.model.QueryPallet;
import com.palette.api.model.QuerySeller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuerySellerRepository extends JpaRepository<QuerySeller, Long> {

    List<QuerySeller> findBySellerId(Long sellerId);
    boolean existsByQueryIdAndSellerId(Long queryId, Long sellerId);

}