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
    public Quote createQuote(String token, CreateQuoteRequest request){
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow();
        Company seller = employee.getCompany();

        QueryPallet queryPallet = queryPalletRepository.findById(request.getQueryPalletId()).orElseThrow();
        Query query = queryPallet.getQuery();

        Company buyer = query.getBuyer();
        List<Employee> buyerEmployees = employeeRepository.findAllByCompany(buyer);

        for (Employee buyerEmployee : buyerEmployees){
            if (buyerEmployee.isEmailNotificationEnabled()){
                mailService.sendQuoteNotification(buyerEmployee);
            }

        }

        boolean sellerAllowed = querySellerRepository.existsByQueryIdAndSellerId(query.getId(), seller.getId());
        if (!sellerAllowed) {
            throw new RuntimeException();
        }

        List<Quote> previousLatestQuotes = quoteRepository.findByQueryPalletAndSellerAndIsLatestTrue(queryPallet, seller);

        for (Quote previousQuote : previousLatestQuotes) {
            previousQuote.setIsLatest(false);
        }

        quoteRepository.saveAll(previousLatestQuotes);

        Quote quote = new Quote();
        quote.setIsLatest(true);
        quote.setDeadline(request.getDeadline());
        quote.setSeller(seller);
        quote.setQueryPallet(queryPallet);
        quote.setPrice(request.getPrice());

        return quoteRepository.save(quote);


    }
}
