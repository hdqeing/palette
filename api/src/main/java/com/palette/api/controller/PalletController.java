package com.palette.api.controller;

import com.palette.api.model.Pallet;
import com.palette.api.repository.PalletRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PalletController {

    private final PalletRepository palletRepository;

    public PalletController(PalletRepository palletRepository) {
        this.palletRepository = palletRepository;
    }

    @PostMapping("/pallet")
    Pallet newPallet(@RequestBody Pallet newPallet) {
        return palletRepository.save(newPallet);
    }

    @GetMapping("/pallets")
    List<Pallet> all() {
        return palletRepository.findAll();
    }
}
