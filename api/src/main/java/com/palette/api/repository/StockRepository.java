package com.palette.api.repository;

import com.palette.api.model.Company;
import com.palette.api.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByCompanyId(Long companyId);
    List<Stock> findByPalletId(Long palletId);
}
