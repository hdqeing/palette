package com.palette.api.controller;

import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only request (query) endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin/requests")
public class AdminRequestController {

    @Autowired private QueryRepository queryRepository;
    @Autowired private QueryPalletRepository queryPalletRepository;
    @Autowired private QuerySellerRepository querySellerRepository;
    @Autowired private QuoteRepository quoteRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private PalletRepository palletRepository;

    // ─── GET all requests (with full detail) ─────────────────────────────────

    @GetMapping
    public ResponseEntity<List<QueryDetailResponse>> getAllRequests() {
        List<Query> queries = queryRepository.findAll();
        return ResponseEntity.ok(queries.stream()
                .map(this::buildDetail)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(@PathVariable Long id) {
        return queryRepository.findById(id)
                .<ResponseEntity<?>>map(q -> ResponseEntity.ok(buildDetail(q)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id));
    }

    @GetMapping("/by-buyer/{buyerId}")
    public ResponseEntity<List<QueryDetailResponse>> getRequestsByBuyer(@PathVariable Long buyerId) {
        List<Query> queries = queryRepository.findByBuyerId(buyerId);
        return ResponseEntity.ok(queries.stream()
                .map(this::buildDetail)
                .collect(Collectors.toList()));
    }

    // ─── POST create request ──────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody CreateQueryRequest request) {
        Company buyer = companyRepository.findById(request.buyerId()).orElse(null);
        if (buyer == null) {
            return ResponseEntity.badRequest().body("Buyer company not found: id=" + request.buyerId());
        }

        if (request.pallets() == null || request.pallets().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one pallet is required");
        }

        // Create the query
        Query query = new Query();
        query.setBuyer(buyer);
        query.setDeadline(request.deadline());
        query.setDeliveryRequest(request.isDeliveryRequest());
        query.setIsClosed(false);
        Query savedQuery = queryRepository.save(query);

        // Attach pallets
        for (PalletEntry entry : request.pallets()) {
            Pallet pallet = palletRepository.findById(entry.palletId()).orElse(null);
            if (pallet == null) {
                return ResponseEntity.badRequest().body("Pallet not found: id=" + entry.palletId());
            }
            QueryPallet qp = new QueryPallet();
            qp.setQuery(savedQuery);
            qp.setPallet(pallet);
            qp.setQuantity(entry.quantity());
            queryPalletRepository.save(qp);
        }

        // Invite sellers
        if (request.sellerIds() != null) {
            for (Long sellerId : request.sellerIds()) {
                Company seller = companyRepository.findById(sellerId).orElse(null);
                if (seller == null) continue;
                QuerySeller qs = new QuerySeller();
                qs.setQuery(savedQuery);
                qs.setSeller(seller);
                qs.setSum(0);
                qs.setAccepted(false);
                qs.setRejected(false);
                querySellerRepository.save(qs);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(buildDetail(savedQuery));
    }

    // ─── PUT update request ───────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(
            @PathVariable Long id,
            @RequestBody UpdateQueryRequest request
    ) {
        Query query = queryRepository.findById(id).orElse(null);
        if (query == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }

        if (request.deadline() != null) query.setDeadline(request.deadline());
        if (request.isDeliveryRequest() != null) query.setDeliveryRequest(request.isDeliveryRequest());
        if (request.isClosed() != null) query.setIsClosed(request.isClosed());

        return ResponseEntity.ok(buildDetail(queryRepository.save(query)));
    }

    // ─── POST add pallet to request ───────────────────────────────────────────

    @PostMapping("/{id}/pallets")
    public ResponseEntity<?> addPallet(
            @PathVariable Long id,
            @RequestBody PalletEntry entry
    ) {
        Query query = queryRepository.findById(id).orElse(null);
        if (query == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }

        Pallet pallet = palletRepository.findById(entry.palletId()).orElse(null);
        if (pallet == null) {
            return ResponseEntity.badRequest().body("Pallet not found: id=" + entry.palletId());
        }

        // Update quantity if pallet already exists in this query
        QueryPallet qp = queryPalletRepository
                .findByQueryIdAndPalletId(id, entry.palletId())
                .orElseGet(() -> {
                    QueryPallet newQp = new QueryPallet();
                    newQp.setQuery(query);
                    newQp.setPallet(pallet);
                    return newQp;
                });

        qp.setQuantity(entry.quantity());
        queryPalletRepository.save(qp);

        return ResponseEntity.ok(buildDetail(query));
    }

    // ─── DELETE pallet from request ───────────────────────────────────────────

    @DeleteMapping("/{id}/pallets/{queryPalletId}")
    public ResponseEntity<?> removePallet(
            @PathVariable Long id,
            @PathVariable Long queryPalletId
    ) {
        if (!queryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }
        if (!queryPalletRepository.existsById(queryPalletId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("QueryPallet not found: id=" + queryPalletId);
        }
        queryPalletRepository.deleteById(queryPalletId);
        return ResponseEntity.noContent().build();
    }

    // ─── POST invite seller ───────────────────────────────────────────────────

    @PostMapping("/{id}/sellers")
    public ResponseEntity<?> inviteSeller(
            @PathVariable Long id,
            @RequestBody SellerInviteRequest request
    ) {
        Query query = queryRepository.findById(id).orElse(null);
        if (query == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }

        Company seller = companyRepository.findById(request.sellerId()).orElse(null);
        if (seller == null) {
            return ResponseEntity.badRequest().body("Seller not found: id=" + request.sellerId());
        }

        if (querySellerRepository.existsByQueryIdAndSellerId(id, request.sellerId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Seller already invited");
        }

        QuerySeller qs = new QuerySeller();
        qs.setQuery(query);
        qs.setSeller(seller);
        qs.setSum(0);
        qs.setAccepted(false);
        qs.setRejected(false);
        querySellerRepository.save(qs);

        return ResponseEntity.status(HttpStatus.CREATED).body(buildDetail(query));
    }

    // ─── DELETE remove seller from request ───────────────────────────────────

    @DeleteMapping("/{id}/sellers/{querySellerEntryId}")
    public ResponseEntity<?> removeSeller(
            @PathVariable Long id,
            @PathVariable Long querySellerEntryId
    ) {
        if (!queryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }
        if (!querySellerRepository.existsById(querySellerEntryId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("QuerySeller not found: id=" + querySellerEntryId);
        }
        querySellerRepository.deleteById(querySellerEntryId);
        return ResponseEntity.noContent().build();
    }

    // ─── DELETE request ───────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        if (!queryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found: id=" + id);
        }
        // Cascade: delete pallets and sellers first
        queryPalletRepository.findByQueryId(id).forEach(qp -> {
            quoteRepository.findByQueryPalletQueryIdAndIsLatestTrue(id)
                    .forEach(quote -> quoteRepository.delete(quote));
            queryPalletRepository.delete(qp);
        });
        querySellerRepository.findByQueryId(id).forEach(querySellerRepository::delete);
        queryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Detail builder ───────────────────────────────────────────────────────

    private QueryDetailResponse buildDetail(Query query) {
        List<QueryPallet> queryPallets = queryPalletRepository.findByQueryId(query.getId());
        List<QuerySeller> querySellers = querySellerRepository.findByQueryId(query.getId());

        List<QueryPalletDetail> palletDetails = queryPallets.stream().map(qp -> {
            List<Quote> latestQuotes = quoteRepository
                    .findByQueryPalletQueryIdAndIsLatestTrue(query.getId())
                    .stream()
                    .filter(q -> q.getQueryPallet().getId().equals(qp.getId()))
                    .collect(Collectors.toList());

            List<QuoteDetail> quoteDetails = latestQuotes.stream()
                    .map(q -> new QuoteDetail(
                            q.getId(),
                            q.getSeller().getId(),
                            q.getSeller().getTitle(),
                            q.getPrice()
                    ))
                    .collect(Collectors.toList());

            return new QueryPalletDetail(
                    qp.getId(),
                    qp.getPallet().getId(),
                    qp.getPallet().getName(),
                    qp.getPallet().getQuality(),
                    qp.getPallet().getPalletSort().getName(),
                    qp.getQuantity(),
                    quoteDetails
            );
        }).collect(Collectors.toList());

        List<SellerDetail> sellerDetails = querySellers.stream()
                .map(qs -> new SellerDetail(
                        qs.getId(),
                        qs.getSeller().getId(),
                        qs.getSeller().getTitle(),
                        qs.getSum(),
                        qs.isAccepted(),
                        qs.isRejected()
                ))
                .collect(Collectors.toList());

        return new QueryDetailResponse(
                query.getId(),
                query.getDeadline(),
                query.isDeliveryRequest(),
                query.getIsClosed(),
                query.getBuyer().getId(),
                query.getBuyer().getTitle(),
                palletDetails,
                sellerDetails
        );
    }

    // ─── Records ──────────────────────────────────────────────────────────────

    record CreateQueryRequest(
            Long buyerId,
            ZonedDateTime deadline,
            boolean isDeliveryRequest,
            List<PalletEntry> pallets,
            List<Long> sellerIds
    ) {}

    record UpdateQueryRequest(
            ZonedDateTime deadline,
            Boolean isDeliveryRequest,
            Boolean isClosed
    ) {}

    record PalletEntry(Long palletId, int quantity) {}

    record SellerInviteRequest(Long sellerId) {}

    record QueryDetailResponse(
            Long id,
            ZonedDateTime deadline,
            boolean isDeliveryRequest,
            Boolean isClosed,
            Long buyerId,
            String buyerName,
            List<QueryPalletDetail> pallets,
            List<SellerDetail> sellers
    ) {}

    record QueryPalletDetail(
            Long queryPalletId,
            Long palletId,
            String palletName,
            String quality,
            String palletSortName,
            int quantity,
            List<QuoteDetail> quotes
    ) {}

    record QuoteDetail(
            Long quoteId,
            Long sellerId,
            String sellerName,
            double price
    ) {}

    record SellerDetail(
            Long querySellerEntryId,
            Long sellerId,
            String sellerName,
            double sum,
            boolean isAccepted,
            boolean isRejected
    ) {}
}