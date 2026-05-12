package com.palette.api.controller;

import com.palette.api.model.Pallet;
import com.palette.api.model.PalletSort;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PalletSortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only pallet endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin")
public class AdminPalletController {

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private PalletSortRepository palletSortRepository;

    // ─── PalletSort endpoints ─────────────────────────────────────────────────

    @GetMapping("/pallet-sort")
    public ResponseEntity<List<PalletSort>> getAllPalletSorts() {
        return ResponseEntity.ok(palletSortRepository.findAll());
    }

    @PostMapping("/pallet-sort")
    public ResponseEntity<?> createPalletSort(@RequestBody PalletSort request) {
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet sort name is required");
        }

        PalletSort saved = palletSortRepository.save(new PalletSort(request.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/pallet-sort/{id}")
    public ResponseEntity<?> updatePalletSort(
            @PathVariable Long id,
            @RequestBody PalletSort request
    ) {
        PalletSort target = palletSortRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + id));

        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet sort name is required");
        }

        target.setName(request.getName());
        return ResponseEntity.ok(palletSortRepository.save(target));
    }

    @DeleteMapping("/pallet-sort/{id}")
    public ResponseEntity<?> deletePalletSort(@PathVariable Long id) {
        if (!palletSortRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("PalletSort not found: id=" + id);
        }
        palletSortRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Pallet endpoints ─────────────────────────────────────────────────────

    @GetMapping("/pallet")
    public ResponseEntity<List<Pallet>> getAllPallets() {
        return ResponseEntity.ok(palletRepository.findAll());
    }

    @GetMapping("/pallet/by-sort/{palletSortId}")
    public ResponseEntity<List<Pallet>> getPalletsBySort(@PathVariable Long palletSortId) {
        return ResponseEntity.ok(palletRepository.findByPalletSort_Id(palletSortId));
    }

    @PostMapping("/pallet")
    public ResponseEntity<?> createPallet(@RequestBody Pallet request) {
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet name is required");
        }

        if (request.getPalletSort() == null || request.getPalletSort().getId() == 0) {
            return ResponseEntity.badRequest().body("Pallet sort is required");
        }

        PalletSort palletSort = palletSortRepository.findById(request.getPalletSort().getId())
                .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + request.getPalletSort().getId()));

        Pallet pallet = new Pallet(
                palletSort,
                request.getBoards(),
                request.getNails(),
                request.getBlocks(),
                request.getLength(),
                request.getWidth(),
                request.getHeight(),
                request.getName(),
                request.getSafeWorkingLoad(),
                request.getWeight(),
                request.getQuality(),
                request.getUrl()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(palletRepository.save(pallet));
    }

    @PutMapping("/pallet/{id}")
    public ResponseEntity<?> updatePallet(
            @PathVariable Long id,
            @RequestBody Pallet request
    ) {
        Pallet target = palletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pallet not found: id=" + id));

        if (request.getPalletSort() != null && request.getPalletSort().getId() != 0) {
            PalletSort palletSort = palletSortRepository.findById(request.getPalletSort().getId())
                    .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + request.getPalletSort().getId()));
            target.setPalletSort(palletSort);
        }

        target.setName(request.getName());
        target.setBoards(request.getBoards());
        target.setNails(request.getNails());
        target.setBlocks(request.getBlocks());
        target.setLength(request.getLength());
        target.setWidth(request.getWidth());
        target.setHeight(request.getHeight());
        target.setSafeWorkingLoad(request.getSafeWorkingLoad());
        target.setWeight(request.getWeight());
        target.setQuality(request.getQuality());
        target.setUrl(request.getUrl());

        return ResponseEntity.ok(palletRepository.save(target));
    }

    @DeleteMapping("/pallet/{id}")
    public ResponseEntity<?> deletePallet(@PathVariable Long id) {
        if (!palletRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Pallet not found: id=" + id);
        }
        palletRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}