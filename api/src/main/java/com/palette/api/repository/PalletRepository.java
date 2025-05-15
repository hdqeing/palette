package com.palette.api.repository;

import com.palette.api.model.Pallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PalletRepository extends JpaRepository<Pallet, Long> {
}
