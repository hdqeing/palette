package com.palette.api.repository;

import com.palette.api.model.Company;
import com.palette.api.model.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueryRepository extends JpaRepository<Query, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT MAX(q.batchId) FROM Query q")
    Long findMaxBatchId();

    List<Query> findByBuyerOrderByCreatedAtDesc(Company buyer);
    List<Query> findBySellerOrderByCreatedAtDesc(Company seller);
}