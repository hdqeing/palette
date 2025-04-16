package com.palette.api.service;

import com.palette.api.model.Seller;
import com.palette.api.repository.SellerRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SellerDetailsService implements UserDetailsService {
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public SellerDetailsService(SellerRepository sellerRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.sellerRepository = sellerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
