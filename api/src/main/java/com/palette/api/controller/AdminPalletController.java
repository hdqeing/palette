package com.palette.api.controller;

import com.palette.api.dto.PalletRequest;
import com.palette.api.dto.PalletResponse;
import com.palette.api.dto.PalletSortRequest;
import com.palette.api.dto.PalletSortResponse;
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
    public ResponseEntity<List<PalletSortResponse>> getAllPalletSorts() {
        return ResponseEntity.ok(palletSortRepository.findAll().stream()
                .map(PalletSortResponse::from)
                .toList());
    }

    @PostMapping("/pallet-sort")
    public ResponseEntity<?> createPalletSort(@RequestBody PalletSortRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet sort name is required");
        }

        PalletSort palletSort = new PalletSort(request.name());
        palletSort.setDescription(request.description());
        PalletSort saved = palletSortRepository.save(palletSort);
        return ResponseEntity.status(HttpStatus.CREATED).body(PalletSortResponse.from(saved));
    }

    @PutMapping("/pallet-sort/{id}")
    public ResponseEntity<?> updatePalletSort(
            @PathVariable Long id,
            @RequestBody PalletSortRequest request
    ) {
        PalletSort target = palletSortRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + id));

        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet sort name is required");
        }

        target.setName(request.name());
        target.setDescription(request.description());
        return ResponseEntity.ok(PalletSortResponse.from(palletSortRepository.save(target)));
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
    public ResponseEntity<List<PalletResponse>> getAllPallets() {
        return ResponseEntity.ok(palletRepository.findAll().stream()
                .map(PalletResponse::from)
                .toList());
    }

    @GetMapping("/pallet/by-sort/{palletSortId}")
    public ResponseEntity<List<PalletResponse>> getPalletsBySort(@PathVariable Long palletSortId) {
        return ResponseEntity.ok(palletRepository.findByPalletSort_Id(palletSortId).stream()
                .map(PalletResponse::from)
                .toList());
    }

    @PostMapping("/pallet")
    public ResponseEntity<?> createPallet(@RequestBody PalletRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Pallet name is required");
        }

        if (request.palletSortId() == null) {
            return ResponseEntity.badRequest().body("Pallet sort is required");
        }

        PalletSort palletSort = palletSortRepository.findById(request.palletSortId())
                .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + request.palletSortId()));

        Pallet pallet = new Pallet(
                palletSort,
                request.epalCode(),
                request.boards(),
                request.nails(),
                request.blocks(),
                request.length(),
                request.width(),
                request.height(),
                request.name(),
                request.safeWorkingLoad(),
                request.weight(),
                request.quality(),
                request.url(),
                request.description(),
                request.materials(),
                request.useCase(),
                request.handling(),
                request.ispm15Required(),
                request.stackingLoad(),
                request.cargoSpaceCubicMeters(),
                request.superimposedLoad(),
                request.revision(),
                request.sourceUrl(),
                request.componentDetails()
        );
        pallet.setCustom(request.custom());

        return ResponseEntity.status(HttpStatus.CREATED).body(PalletResponse.from(palletRepository.save(pallet)));
    }

    @PutMapping("/pallet/{id}")
    public ResponseEntity<?> updatePallet(
            @PathVariable Long id,
            @RequestBody PalletRequest request
    ) {
        Pallet target = palletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pallet not found: id=" + id));

        if (request.palletSortId() != null) {
            PalletSort palletSort = palletSortRepository.findById(request.palletSortId())
                    .orElseThrow(() -> new RuntimeException("PalletSort not found: id=" + request.palletSortId()));
            target.setPalletSort(palletSort);
        }

        target.setName(request.name());
        target.setEpalCode(request.epalCode());
        target.setBoards(request.boards());
        target.setNails(request.nails());
        target.setBlocks(request.blocks());
        target.setLength(request.length());
        target.setWidth(request.width());
        target.setHeight(request.height());
        target.setSafeWorkingLoad(request.safeWorkingLoad());
        target.setWeight(request.weight());
        target.setQuality(request.quality());
        target.setUrl(request.url());
        target.setDescription(request.description());
        target.setCustom(request.custom());
        target.setMaterials(request.materials());
        target.setUseCase(request.useCase());
        target.setHandling(request.handling());
        target.setIspm15Required(request.ispm15Required());
        target.setStackingLoad(request.stackingLoad());
        target.setCargoSpaceCubicMeters(request.cargoSpaceCubicMeters());
        target.setSuperimposedLoad(request.superimposedLoad());
        target.setRevision(request.revision());
        target.setSourceUrl(request.sourceUrl());
        if (request.componentDetails() != null) {
            target.setComponentDetails(request.componentDetails());
        }

        return ResponseEntity.ok(PalletResponse.from(palletRepository.save(target)));
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
