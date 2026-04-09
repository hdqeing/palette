package com.palette.api.controller;

import com.palette.api.dto.UpdatePriceRequest;
import com.palette.api.dto.UpdatePriceResponse;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PalletSortRepository;
import com.palette.api.repository.QueryRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/pallets")
public class PalletController {

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private PalletSortRepository palletSortRepository;

    @PostMapping("")
    Pallet newPallet(@RequestBody Pallet newPallet) {
        return palletRepository.save(newPallet);
    }

    @GetMapping("")
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
