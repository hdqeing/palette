package com.palette.api.controller;

import com.palette.api.dto.StockResponse;
import com.palette.api.model.Company;
import com.palette.api.model.Pallet;
import com.palette.api.model.Stock;
import com.palette.api.repository.CompanyRepository;
import com.palette.api.repository.PalletRepository;
import com.palette.api.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only inventory (stock) endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin/inventory")
public class AdminStockController {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PalletRepository palletRepository;

    @GetMapping
    public ResponseEntity<List<StockResponse>> getAllStock() {
        return ResponseEntity.ok(stockRepository.findAll().stream().map(StockResponse::from).toList());
    }

    @GetMapping("/by-company/{companyId}")
    public ResponseEntity<List<StockResponse>> getStockByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(stockRepository.findByCompanyId(companyId).stream().map(StockResponse::from).toList());
    }

    @GetMapping("/by-pallet/{palletId}")
    public ResponseEntity<List<StockResponse>> getStockByPallet(@PathVariable Long palletId) {
        return ResponseEntity.ok(stockRepository.findByPalletId(palletId).stream().map(StockResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStock(@PathVariable Long id) {
        return stockRepository.findById(id)
                .map(StockResponse::from)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Stock not found: id=" + id));
    }

    @PostMapping
    public ResponseEntity<?> createStock(@RequestBody StockRequest request) {
        Company company = companyRepository.findById(request.companyId())
                .orElse(null);
        if (company == null) {
            return ResponseEntity.badRequest().body("Company not found: id=" + request.companyId());
        }

        Pallet pallet = palletRepository.findById(request.palletId())
                .orElse(null);
        if (pallet == null) {
            return ResponseEntity.badRequest().body("Pallet not found: id=" + request.palletId());
        }

        if (request.quantity() < 0) {
            return ResponseEntity.badRequest().body("Quantity cannot be negative");
        }

        if (request.price() < 0) {
            return ResponseEntity.badRequest().body("Price cannot be negative");
        }

        Stock stock = new Stock();
        stock.setCompany(company);
        stock.setPallet(pallet);
        stock.setQuantity(request.quantity());
        stock.setPrice(request.price());

        return ResponseEntity.status(HttpStatus.CREATED).body(StockResponse.from(stockRepository.save(stock)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestBody StockRequest request
    ) {
        Stock stock = stockRepository.findById(id)
                .orElse(null);
        if (stock == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock not found: id=" + id);
        }

        if (request.companyId() != null) {
            Company company = companyRepository.findById(request.companyId())
                    .orElse(null);
            if (company == null) {
                return ResponseEntity.badRequest().body("Company not found: id=" + request.companyId());
            }
            stock.setCompany(company);
        }

        if (request.palletId() != null) {
            Pallet pallet = palletRepository.findById(request.palletId())
                    .orElse(null);
            if (pallet == null) {
                return ResponseEntity.badRequest().body("Pallet not found: id=" + request.palletId());
            }
            stock.setPallet(pallet);
        }

        if (request.quantity() >= 0) stock.setQuantity(request.quantity());
        if (request.price() >= 0) stock.setPrice(request.price());

        return ResponseEntity.ok(StockResponse.from(stockRepository.save(stock)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Long id) {
        if (!stockRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock not found: id=" + id);
        }
        stockRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Request record ───────────────────────────────────────────────────────

    record StockRequest(
            Long companyId,
            Long palletId,
            int quantity,
            double price
    ) {}
}