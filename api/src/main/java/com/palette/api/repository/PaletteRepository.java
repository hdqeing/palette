package com.palette.api.repository;

import com.palette.api.model.Palette;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaletteRepository extends JpaRepository<Palette, Long> {
}
