package com.palette.api.controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.palette.api.dto.CreateStockRequest;
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

    @PostMapping()
    public ResponseEntity<Stock> newStock(@CookieValue("jwt-token") String token, @RequestBody CreateStockRequest request){
        Long palletId = request.getPaletteId();
        Pallet pallet = palletRepository.findById(palletId).orElseThrow(() -> new PalletNotFoundException(palletId));

        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        // Find employee by email
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();


        Stock newStock = new Stock();
        newStock.setCompany(seller);
        newStock.setPallet(pallet);
        newStock.setQuantity(request.getQuantity());
        newStock.setPrice(request.getPrice());

        newStock = stockRepository.save(newStock);

        List<Photo> photos = new ArrayList<>();
        for (Long photoId : request.getPhotoIds()){
            Photo photo = photoRepository.findById(photoId).orElseThrow();
            photo.setStock(newStock);
            photos.add(photo);
        }

        photoRepository.saveAll(photos);

        newStock.setPhotos(photos);


        return ResponseEntity.ok(newStock);

    }

    @GetMapping()
    public ResponseEntity<List<Stock>> getMyStocks(@CookieValue("jwt-token") String token){
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();

        List<Stock> myStocks = stockRepository.findByCompany(seller);
        return ResponseEntity.ok(myStocks);
    }
}
