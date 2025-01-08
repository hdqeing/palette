package com.palette.api.controller;

import com.palette.api.model.Palette;
import com.palette.api.repository.PaletteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaletteController {
    private final PaletteRepository paletteRepository;

    public PaletteController(PaletteRepository paletteRepository) {
        this.paletteRepository = paletteRepository;
    }

    @GetMapping("/paletten")
    List<Palette> all(){
        return paletteRepository.findAll();
    }
}
