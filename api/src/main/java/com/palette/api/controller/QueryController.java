package com.palette.api.controller;

import com.palette.api.dto.CreateQueryRequest;
import com.palette.api.dto.ItemQuantity;
import com.palette.api.dto.QueryResponseDto;
import com.palette.api.dto.SellerQueryResponseDto;
import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class QueryController {

    private final QueryRepository queryRepository;
    private final QueryPalletRepository queryPalletRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final PalletRepository palletRepository;

    public QueryController(QueryRepository queryRepository,
                           QueryPalletRepository queryPalletRepository,
                           EmployeeRepository employeeRepository,
                           CompanyRepository companyRepository,
                           PalletRepository palletRepository) {
        this.queryRepository = queryRepository;
        this.queryPalletRepository = queryPalletRepository;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.palletRepository = palletRepository;
    }

    @PostMapping("/query")
    @Transactional
    public ResponseEntity<String> newQuery(@RequestBody CreateQueryRequest createQueryRequest,
                                           Authentication authentication) {
        try {
            // Get the authenticated user's email
            String userEmail = authentication.getName();

            // Find the employee by email
            Employee employee = employeeRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Get the company of the authenticated user (buyer)
            Company buyerCompany = employee.getCompany();
            if (buyerCompany == null) {
                return ResponseEntity.badRequest().body("Employee has no associated company");
            }

            List<Long> sellerIds = createQueryRequest.getSellers();
            List<ItemQuantity> itemQuantities = createQueryRequest.getItemQuantities();

            // Validate sellers exist
            List<Company> sellers = companyRepository.findAllById(sellerIds);
            if (sellers.size() != sellerIds.size()) {
                return ResponseEntity.badRequest().body("One or more seller companies not found");
            }

            // Validate pallets exist
            List<Long> palletIds = itemQuantities.stream()
                    .map(ItemQuantity::getPalletId)
                    .collect(Collectors.toList());
            List<Pallet> pallets = palletRepository.findAllById(palletIds);
            if (pallets.size() != palletIds.size()) {
                return ResponseEntity.badRequest().body("One or more pallets not found");
            }

            // Create a map for quick pallet lookup
            Map<Long, Pallet> palletMap = pallets.stream()
                    .collect(Collectors.toMap(Pallet::getId, pallet -> pallet));

            // Generate the next batch ID
            Long nextBatchId = getNextBatchId();
            ZonedDateTime now = ZonedDateTime.now();

            // For each seller, create a query
            for (Company seller : sellers) {
                Query query = new Query();
                query.setBuyer(buyerCompany);
                query.setSeller(seller);
                query.setBatchId(nextBatchId); // Set automatic batch ID
                query.setCreatedAt(now); // Set automatic creation time

                // Save the query
                query = queryRepository.save(query);

                // For each item/pallet, create QueryPallet entries
                for (ItemQuantity itemQuantity : itemQuantities) {
                    Pallet pallet = palletMap.get(itemQuantity.getPalletId());

                    QueryPallet queryPallet = new QueryPallet();
                    queryPallet.setQuery(query);
                    queryPallet.setPallet(pallet);
                    queryPallet.setQuantity(itemQuantity.getQuantity());

                    queryPalletRepository.save(queryPallet);
                }
            }

            return ResponseEntity.ok("Your queries have been sent successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating queries: " + e.getMessage());
        }
    }

    @GetMapping("/queries")
    public ResponseEntity<List<QueryResponseDto>> getCompanyQueries(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String userEmail = authentication.getName();

            // Find the employee by email
            Employee employee = employeeRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Get the company of the authenticated user
            Company company = employee.getCompany();
            if (company == null) {
                return ResponseEntity.badRequest().build();
            }

            // Find all queries where the company is the buyer
            List<Query> queries = queryRepository.findByBuyerOrderByCreatedAtDesc(company);

            // Convert to DTOs
            List<QueryResponseDto> queryDtos = queries.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(queryDtos);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/queries/received")
    public ResponseEntity<List<SellerQueryResponseDto>> getReceivedQueries(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String userEmail = authentication.getName();

            // Find the employee by email
            Employee employee = employeeRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            // Get the company of the authenticated user
            Company company = employee.getCompany();
            if (company == null) {
                return ResponseEntity.badRequest().build();
            }

            // Find all queries where the company is the seller
            List<Query> queries = queryRepository.findBySellerOrderByCreatedAtDesc(company);

            // Convert to DTOs
            List<SellerQueryResponseDto> queryDtos = queries.stream()
                    .map(this::convertToSellerDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(queryDtos);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private QueryResponseDto convertToDto(Query query) {
        QueryResponseDto dto = new QueryResponseDto();
        dto.setId(query.getId());

        dto.setBatchId(query.getBatchId());
        dto.setCreatedAt(query.getCreatedAt());

        // Get all QueryPallet entries for this query
        List<QueryPallet> queryPallets = queryPalletRepository.findByQuery(query);

        List<QueryResponseDto.QueryItemDto> items = queryPallets.stream()
                .map(qp -> {
                    QueryResponseDto.QueryItemDto item = new QueryResponseDto.QueryItemDto();
                    item.setPalletId(qp.getPallet().getId());
                    item.setPalletName(qp.getPallet().getSort().getName()); // Using PalletSort name
                    item.setQuantity(qp.getQuantity());
                    item.setPrice(qp.getPrice());
                    return item;
                })
                .collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }

    private SellerQueryResponseDto convertToSellerDto(Query query) {
        SellerQueryResponseDto dto = new SellerQueryResponseDto();
        dto.setId(query.getId());
        dto.setBatchId(query.getBatchId());
        dto.setCreatedAt(query.getCreatedAt());

        // Set buyer information
        SellerQueryResponseDto.BuyerInfoDto buyerDto = new SellerQueryResponseDto.BuyerInfoDto();
        buyerDto.setId(query.getBuyer().getId());
        buyerDto.setName(query.getBuyer().getTitle());
        dto.setBuyer(buyerDto);

        // Get all QueryPallet entries for this query
        List<QueryPallet> queryPallets = queryPalletRepository.findByQuery(query);

        List<SellerQueryResponseDto.QueryItemDetailDto> items = queryPallets.stream()
                .map(qp -> {
                    SellerQueryResponseDto.QueryItemDetailDto item = new SellerQueryResponseDto.QueryItemDetailDto();
                    item.setPalletId(qp.getPallet().getId());
                    item.setPalletQuality(qp.getPallet().getQuality());
                    item.setPalletUrl(qp.getPallet().getUrl());
                    item.setQuantity(qp.getQuantity());
                    item.setPrice(qp.getPrice());

                    // Set pallet sort information
                    SellerQueryResponseDto.PalletSortDto palletSortDto = new SellerQueryResponseDto.PalletSortDto();
                    palletSortDto.setId(qp.getPallet().getSort().getId());
                    palletSortDto.setName(qp.getPallet().getSort().getName());
                    palletSortDto.setLength(qp.getPallet().getSort().getLength());
                    palletSortDto.setWidth(qp.getPallet().getSort().getWidth());
                    palletSortDto.setHeight(qp.getPallet().getSort().getHeight());
                    item.setPalletSort(palletSortDto);

                    return item;
                })
                .collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }

    private Long getNextBatchId() {
        Long maxBatchId = queryRepository.findMaxBatchId();
        return (maxBatchId == null) ? 1L : maxBatchId + 1L;
    }
}