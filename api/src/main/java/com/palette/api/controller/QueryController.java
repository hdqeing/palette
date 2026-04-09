package com.palette.api.controller;

import com.palette.api.dto.CreateQueryRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.QueryPalletRepository;
import com.palette.api.repository.QueryRepository;
import com.palette.api.repository.QuerySellerRepository;
import com.palette.api.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class QueryController {

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

    @PostMapping("/queries")
    Query newQuery(@CookieValue("jwt-token") String token, @RequestBody CreateQueryRequest createQueryRequest){
        return queryService.createQuery(token, createQueryRequest);
    }

    @GetMapping("/queries/{id}/pallets")
    List<QueryPallet> getItemsWithQuery(@PathVariable Long id){
        List<QueryPallet> queryPallets = queryPalletRepository.findByQueryId(id);
        return queryPallets;
    }

    @GetMapping("/buyer/queries")
    List<Query> getQueriesForBuyer(@CookieValue("jwt-token") String token){
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        Employee employee = employeeRepository.findByEmail(email).orElseThrow();

        Company buyer = employee.getCompany();

        return queryRepository.findByBuyerId(buyer.getId());
    }

    @GetMapping("/seller/queries")
    List<QuerySeller> getQueriesForSeller(@CookieValue("jwt-token") String token){
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        // Find employee by email
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();

        return querySellerRepository.findBySellerId(seller.getId());

    }
}