package com.palette.api.controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.palette.api.dto.CreateStockRequest;
import com.palette.api.dto.UpdateStockRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.exception.PalletNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.PhotoRepository;
import com.palette.api.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/stocks")
public class StockController {

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Value("${azure.storage.connection-string}")
    private String connString;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<Stock> newStock(
            @CookieValue("jwt-token") String token,
            @RequestPart("stock") CreateStockRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        Company seller = employee.getCompany();

        Pallet pallet = palletRepository.findById(request.getPaletteId())
                .orElseThrow(() -> new PalletNotFoundException(request.getPaletteId()));

        Stock stock = new Stock();
        stock.setCompany(seller);
        stock.setPallet(pallet);
        stock.setQuantity(request.getQuantity());
        stock.setPrice(request.getPrice());

        Stock savedStock = stockRepository.save(stock);

        List<Photo> photos = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String filename = seller.getId()
                        + "/stocks/"
                        + savedStock.getId()
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
                    throw new RuntimeException("Failed to upload image", e);
                }

                Photo photo = new Photo();
                photo.setBlobName(filename);
                photo.setOwner(seller);
                photo.setStock(savedStock);

                photos.add(photo);
            }
        }

        photoRepository.saveAll(photos);
        savedStock.setPhotos(photos);

        return ResponseEntity.ok(savedStock);
    }

    @GetMapping()
    public ResponseEntity<List<Stock>> getAllStocks(){
        List<Stock> stocks = stockRepository.findAll();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Stock>> getStocksBySeller(@CookieValue("jwt-token") String token){
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        // Find employee by email
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();

        return ResponseEntity.ok(stockRepository.findByCompanyId(seller.getId()));
    }


    @GetMapping("/pallet/{palletId}")
    public ResponseEntity<List<Stock>> getStocksByPallet(@PathVariable Long palletId){
        List<Stock> stocks = stockRepository.findByPalletId(palletId);
        return ResponseEntity.ok(stocks);
    }

    @DeleteMapping("/{stockId}")
    @Transactional
    public ResponseEntity<Void> deleteStock(
            @CookieValue("jwt-token") String token,
            @PathVariable Long stockId
    ) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        Company seller = employee.getCompany();

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found: " + stockId));

        if (!stock.getCompany().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        stockRepository.delete(stock);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{stockId}")
    @Transactional
    public ResponseEntity<Stock> updateStock(
            @CookieValue("jwt-token") String token,
            @PathVariable Long stockId,
            @RequestPart("stock") UpdateStockRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        Company seller = employee.getCompany();

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found: " + stockId));

        if (!stock.getCompany().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        Pallet pallet = palletRepository.findById(request.getPaletteId())
                .orElseThrow(() -> new PalletNotFoundException(request.getPaletteId()));

        stock.setPallet(pallet);
        stock.setQuantity(request.getQuantity());
        stock.setPrice(request.getPrice());

        // Only delete photos not in keepPhotoIds
        List<Long> keepPhotoIds = request.getKeepPhotoIds() != null ? request.getKeepPhotoIds() : List.of();
        List<Photo> photosToDelete = stock.getPhotos().stream()
                .filter(p -> !keepPhotoIds.contains(p.getId()))
                .toList();

        for (Photo photo : photosToDelete) {
            BlobClient client = new BlobClientBuilder()
                    .connectionString(connString)
                    .containerName("pallet-images")
                    .blobName(photo.getBlobName())
                    .buildClient();
            client.deleteIfExists();
        }
        photoRepository.deleteAll(photosToDelete);
        stock.getPhotos().removeAll(photosToDelete);

        // Upload new photos
        if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String filename = seller.getId()
                        + "/stocks/"
                        + stockId
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
                    throw new RuntimeException("Failed to upload image", e);
                }

                Photo photo = new Photo();
                photo.setBlobName(filename);
                photo.setOwner(seller);
                photo.setStock(stock);

                stock.getPhotos().add(photo);
                photoRepository.save(photo);
            }
        }

        return ResponseEntity.ok(stockRepository.save(stock));
    }
}
