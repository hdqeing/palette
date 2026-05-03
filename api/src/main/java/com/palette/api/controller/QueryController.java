package com.palette.api.controller;

import com.palette.api.dto.*;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.*;
import com.palette.api.service.QueryService;
import com.palette.api.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class QueryController {

    @Autowired
    private QuoteService quoteService;

    @Autowired
    private QueryService queryService;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private QuerySellerRepository querySellerRepository;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private QueryPalletRepository queryPalletRepository;

    @Autowired
    private QuoteRepository quoteRepository;


    @PostMapping("/queries")
    Query newQuery(@CookieValue("jwt-token") String token, @RequestBody CreateQueryRequest createQueryRequest) {
        return queryService.createQuery(token, createQueryRequest);
    }

    @GetMapping("/queries/{id}")
    public ResponseEntity<?> getQueryDetails(
            @PathVariable Long id,
            @CookieValue(value = "jwt-token", required = false) String token
    ) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
            }

            QueryDetailsResponse response = queryService.getQueryDetails(token, id);
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving query details");
        }
    }

    @GetMapping("/queries/{id}/pallets")
    List<QueryPallet> getItemsWithQuery(@PathVariable Long id) {
        return queryPalletRepository.findByQueryId(id);
    }

    @GetMapping("/buyer/queries")
    List<BuyerQueryResponse> getQueriesForBuyer(@CookieValue("jwt-token") String token) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email).orElseThrow();
        Company buyer = employee.getCompany();

        List<Query> queries = queryRepository.findByBuyerId(buyer.getId());

        return queries.stream().map(query -> {
            BuyerQueryResponse response = new BuyerQueryResponse();
            response.setId(query.getId());
            response.setDeadline(query.getDeadline());
            response.setIsClosed(query.getIsClosed());

            List<Company> sellers = querySellerRepository.findByQueryId(query.getId())
                    .stream()
                    .map(QuerySeller::getSeller)
                    .toList();
            response.setSellers(sellers);

            List<BuyerQueryPalletResponse> pallets = queryPalletRepository.findByQueryId(query.getId())
                    .stream()
                    .map(queryPallet -> {
                        BuyerQueryPalletResponse palletResponse = new BuyerQueryPalletResponse();
                        palletResponse.setPallet(queryPallet.getPallet());
                        palletResponse.setQuantity(queryPallet.getQuantity());
                        return palletResponse;
                    })
                    .toList();
            response.setPallets(pallets);

            return response;
        }).toList();
    }


    @GetMapping("/seller/queries")
    public ResponseEntity<?> getQueriesForSeller(@CookieValue(value = "jwt-token", required = false) String token) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
            }

            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));
            Company seller = employee.getCompany();

            List<QuerySeller> querySellerEntries = querySellerRepository.findBySellerId(seller.getId());

            List<SellerQueryResponse> response = querySellerEntries.stream().map(querySeller -> {
                Query query = querySeller.getQuery();

                List<SellerQueryPalletResponse> pallets = queryPalletRepository.findByQueryId(query.getId())
                        .stream()
                        .map(queryPallet -> {
                            SellerQueryPalletResponse palletResponse = new SellerQueryPalletResponse();
                            palletResponse.setQueryPalletId(queryPallet.getId());
                            palletResponse.setPallet(queryPallet.getPallet());
                            palletResponse.setQuantity(queryPallet.getQuantity());

                            // attach the seller's quote for this pallet if it exists
                            quoteRepository.findByQueryPalletIdAndSellerId(queryPallet.getId(), seller.getId())
                                    .ifPresent(quote -> palletResponse.setQuotedPrice(quote.getPrice()));

                            return palletResponse;
                        })
                        .toList();

                SellerQueryResponse sellerQueryResponse = new SellerQueryResponse();
                sellerQueryResponse.setQueryId(query.getId());
                sellerQueryResponse.setDeadline(query.getDeadline());
                sellerQueryResponse.setIsClosed(query.getIsClosed());
                sellerQueryResponse.setDeliveryRequest(query.isDeliveryRequest());
                sellerQueryResponse.setBuyer(query.getBuyer());
                sellerQueryResponse.setPallets(pallets);
                sellerQueryResponse.setAccepted(querySeller.isAccepted());
                sellerQueryResponse.setRejected(querySeller.isRejected());
                sellerQueryResponse.setSum(querySeller.getSum());

                return sellerQueryResponse;
            }).toList();

            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving queries");
        }
    }




    @PutMapping("/queries/{queryId}/seller/{sellerId}/accept")
    public QuerySeller acceptQuote(
            @CookieValue("jwt-token") String token,
            @PathVariable Long queryId,
            @PathVariable Long sellerId
    ) {
        return quoteService.acceptQuote(token, queryId, sellerId);
    }

    @PutMapping("/queries/{queryId}/seller/{sellerId}/reject")
    public QuerySeller rejectQuote(
            @CookieValue("jwt-token") String token,
            @PathVariable Long queryId,
            @PathVariable Long sellerId
    ) {
        return quoteService.rejectQuote(token, queryId, sellerId);
    }

}