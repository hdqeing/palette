package com.palette.api.repository;

import com.palette.api.model.PalletCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PalletCategoryRepository extends JpaRepository<PalletCategory, Long> {
}
