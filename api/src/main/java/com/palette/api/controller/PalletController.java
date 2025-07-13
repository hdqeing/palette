package com.palette.api.controller;

import com.palette.api.model.Pallet;
import com.palette.api.model.PalletSort;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PalletSortRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class PalletController {

    private final PalletRepository palletRepository;
    private final PalletSortRepository palletSortRepository;

    public PalletController(PalletRepository palletRepository, PalletSortRepository palletSortRepository) {
        this.palletRepository = palletRepository;
        this.palletSortRepository = palletSortRepository;
    }

    @PostMapping("/pallet")
    Pallet newPallet(@RequestBody Pallet newPallet) {
        return palletRepository.save(newPallet);
    }

    @GetMapping("/pallets")
    List<Pallet> all() {
        return palletRepository.findAll();
    }

    @GetMapping("/sorts")
    List<PalletSort> allSorts() {
        return palletSortRepository.findAll();
    }

    @GetMapping("/sort/{sortId}/pallets")
    ResponseEntity<List<Pallet>> getPalletsWithSort(@PathVariable String sortId) {
        try {
            Long id = Long.parseLong(sortId);
            List<Pallet> pallets = palletRepository.findBySort_Id(id);
            return ResponseEntity.ok(pallets);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
