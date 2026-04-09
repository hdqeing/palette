package com.palette.api.repository;

import com.palette.api.model.Pallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PalletRepository extends JpaRepository<Pallet, Long> {
    List<Pallet> findBySort_Id(Long sortId);
}
