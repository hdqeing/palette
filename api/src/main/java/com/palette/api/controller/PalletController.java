package com.palette.api.controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PalletSortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequestMapping("/v1/pallets")
public class PalletController {

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private PalletSortRepository palletSortRepository;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Value("${azure.storage.connection-string}")
    private String connString;

    @PostMapping("")
    Pallet newPallet(@RequestBody Pallet newPallet) {
        return palletRepository.save(newPallet);
    }

    /**
     * GET /v1/pallets
     * Returns all standard (non-custom) pallets.
     */
    @GetMapping("")
    List<Pallet> all() {
        return palletRepository.findByCustomFalse();
    }

    /**
     * GET /v1/pallets/my
     * Returns all standard pallets plus any custom pallets owned by the
     * authenticated user's company.
     */
    @GetMapping("/my")
    public ResponseEntity<?> myPallets(@CookieValue(value = "jwt-token", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        Jwt jwt = jwtDecoder.decode(token);
        Employee employee = employeeRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() -> new EmployeeNotFoundException(jwt.getSubject()));
        Company company = employee.getCompany();

        List<Pallet> standard = palletRepository.findByCustomFalse();
        List<Pallet> custom = palletRepository.findByCustomTrueAndOwnerId(company.getId());

        List<Pallet> result = Stream.concat(standard.stream(), custom.stream()).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sorts")
    List<PalletSort> allSorts() {
        return palletSortRepository.findAll();
    }

    @GetMapping("/sort/{sortId}/pallets")
    ResponseEntity<List<Pallet>> getPalletsWithSort(@PathVariable String sortId) {
        try {
            Long id = Long.parseLong(sortId);
            List<Pallet> pallets = palletRepository.findByPalletSort_Id(id);
            return ResponseEntity.ok(pallets);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /v1/pallets/custom
     * Creates a custom pallet for the authenticated user's company and uploads
     * the provided file to Azure Blob Storage.
     */
    @PostMapping(value = "/custom", consumes = "multipart/form-data")
    public ResponseEntity<?> createCustomPallet(
            @CookieValue(value = "jwt-token", required = false) String token,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file
    ) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File must not be empty");
        }

        Jwt jwt = jwtDecoder.decode(token);
        Employee employee = employeeRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() -> new EmployeeNotFoundException(jwt.getSubject()));
        Company company = employee.getCompany();

        String filename = "custom/"
                + company.getId()
                + "/"
                + UUID.randomUUID()
                + "-"
                + file.getOriginalFilename();

        BlobClient client = new BlobClientBuilder()
                .connectionString(connString)
                .containerName("pallet-images")
                .blobName(filename)
                .buildClient();

        try {
            client.upload(file.getInputStream(), file.getSize(), true);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }

        Pallet pallet = new Pallet();
        pallet.setName(name);
        pallet.setDescription(description);
        pallet.setUrl(client.getBlobUrl());
        pallet.setCustom(true);
        pallet.setOwner(company);

        return ResponseEntity.status(HttpStatus.CREATED).body(palletRepository.save(pallet));
    }
}