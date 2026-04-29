package com.palette.api.repository;

import com.palette.api.model.Query;
import com.palette.api.model.QueryPallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueryPalletRepository extends JpaRepository<QueryPallet, Long> {
    List<QueryPallet> findByQuery(Query query);

    // Find all QueryPallets for a specific Query
    List<QueryPallet> findByQueryId(Long queryId);
    // Find all QueryPallets for a specific Query and Pallet
    List<QueryPallet> findByQueryIdAndPalletId(Long queryId, Long palletId);


}