package com.palette.api.service;

import com.palette.api.dto.CreateQuoteRequest;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.QueryPalletRepository;
import com.palette.api.repository.QuerySellerRepository;
import com.palette.api.repository.QuoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteService {
    @Autowired
    JwtDecoder jwtDecoder;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    QueryPalletRepository queryPalletRepository;

    @Autowired
    QuerySellerRepository querySellerRepository;

    @Autowired
    QuoteRepository quoteRepository;

    @Autowired
    MailService mailService;

    @Transactional
    public Quote createQuote(String token, CreateQuoteRequest request) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email).orElseThrow();
        Company seller = employee.getCompany();

        QueryPallet queryPallet = queryPalletRepository.findById(request.getQueryPalletId())
                .orElseThrow();

        Query query = queryPallet.getQuery();

        boolean sellerAllowed = querySellerRepository.existsByQueryIdAndSellerId(
                query.getId(),
                seller.getId()
        );

        if (!sellerAllowed) {
            throw new RuntimeException("Seller is not allowed to quote for this query");
        }

        List<Quote> previousLatestQuotes =
                quoteRepository.findByQueryPalletAndSellerAndIsLatestTrue(queryPallet, seller);

        for (Quote previousQuote : previousLatestQuotes) {
            previousQuote.setIsLatest(false);
        }

        quoteRepository.saveAll(previousLatestQuotes);

        Quote quote = new Quote();
        quote.setIsLatest(true);
        quote.setSeller(seller);
        quote.setQueryPallet(queryPallet);
        quote.setPrice(request.getPrice());

        Quote savedQuote = quoteRepository.save(quote);

        updateQuerySellerSum(query.getId(), seller.getId());

        Company buyer = query.getBuyer();
        List<Employee> buyerEmployees = employeeRepository.findAllByCompany(buyer);

        for (Employee buyerEmployee : buyerEmployees) {
            if (buyerEmployee.isEmailNotificationEnabled()) {
                mailService.sendQuoteNotification(buyerEmployee);
            }
        }

        return savedQuote;
    }

    @Transactional
    public QuerySeller rejectQuote(String token, Long queryId, Long sellerId) {
        Employee employee = getEmployeeFromToken(token);
        Company buyer = employee.getCompany();

        if (buyer == null) {
            throw new RuntimeException("Employee has no company");
        }

        QuerySeller querySeller = querySellerRepository.findByQueryIdAndSellerId(queryId, sellerId)
                .orElseThrow(() -> new RuntimeException("QuerySeller not found"));

        Query query = querySeller.getQuery();

        if (!query.getBuyer().getId().equals(buyer.getId())) {
            throw new RuntimeException("Only the buyer company can reject this quote");
        }

        querySeller.setRejected(true);
        querySeller.setAccepted(false);

        return querySellerRepository.save(querySeller);
    }

    @Transactional
    public QuerySeller acceptQuote(String token, Long queryId, Long sellerId) {
        Employee employee = getEmployeeFromToken(token);
        Company buyer = employee.getCompany();

        if (buyer == null) {
            throw new RuntimeException("Employee has no company");
        }

        QuerySeller acceptedQuerySeller = querySellerRepository.findByQueryIdAndSellerId(queryId, sellerId)
                .orElseThrow(() -> new RuntimeException("QuerySeller not found"));

        Query query = acceptedQuerySeller.getQuery();

        if (!query.getBuyer().getId().equals(buyer.getId())) {
            throw new RuntimeException("Only the buyer company can accept this quote");
        }

        List<QuerySeller> allQuerySellers =
                querySellerRepository.findByQueryId(query.getId());

        for (QuerySeller querySeller : allQuerySellers) {
            if (querySeller.getId().equals(acceptedQuerySeller.getId())) {
                querySeller.setAccepted(true);
                querySeller.setRejected(false);
            } else {
                querySeller.setAccepted(false);
                querySeller.setRejected(true);
            }
        }

        query.setIsClosed(true);

        querySellerRepository.saveAll(allQuerySellers);

        return acceptedQuerySeller;
    }

    private Employee getEmployeeFromToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        return employeeRepository.findByEmail(email)
                .orElseThrow();
    }

    private void updateQuerySellerSum(Long queryId, Long sellerId) {
        QuerySeller querySeller = querySellerRepository.findByQueryIdAndSellerId(queryId, sellerId)
                .orElseThrow(() -> new RuntimeException("QuerySeller not found"));

        List<Quote> latestQuotes =
                quoteRepository.findByQueryPalletQueryIdAndSellerIdAndIsLatestTrue(
                        queryId,
                        sellerId
                );

        double sum = latestQuotes.stream()
                .mapToDouble(quote ->
                        quote.getPrice() * quote.getQueryPallet().getQuantity()
                )
                .sum();

        querySeller.setSum(sum);
        querySellerRepository.save(querySeller);
    }

}
