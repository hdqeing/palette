//package com.palette.api.service;
//
//import com.palette.api.model.Seller;
//import com.palette.api.repository.SellerRepository;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class SellerAuthService {
//    private final SellerRepository sellerRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final AuthenticationManager authenticationManager;
//
//    public SellerAuthService(SellerRepository sellerRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
//        this.sellerRepository = sellerRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.authenticationManager = authenticationManager;
//    }
//
//    public Seller signup(){
//        Seller seller = new Seller();
//        seller.setEmail("myemail");
//        return seller;
//    }
//
//    public Seller authenticate(){
//        return sellerRepository.findByEmail();
//    }
//
//
//}
