package com.palette.api.controller;

import com.palette.api.dto.*;
import com.palette.api.exception.CustomerNotFoundException;
import com.palette.api.model.Employee;
import com.palette.api.repository.EmployeeRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@SecurityRequirement(name = "bearerAuth")

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private JavaMailSender emailSender;

    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    @Autowired
    JwtEncoder jwtEncoder;

    public AuthController( PasswordEncoder passwordEncoder, EmployeeRepository employeeRepository) {
        this.passwordEncoder = passwordEncoder;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/email/verification")
    public ResponseEntity<String> verifyEmail(@RequestParam String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("auth@palette365.de");
        message.setTo(email);
        message.setSubject("Verification Code");
        Random random = new Random();
        String code = String.valueOf(100000 + random.nextInt(900000));
        return ResponseEntity.ok("An Email with verification code has been sent, click Next to proceed.");
    }

    @PostMapping("/seller/email/verification")
    public ResponseEntity<EmailVerificationResponse> verifySellerEmail(@RequestBody EmailVerificationRequest request) {
        String email = request.getEmail();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("auth@palette365.de");
        message.setTo(email);
        message.setSubject("Verification Code");
        Random random = new Random();
        String code = String.valueOf(100000 + random.nextInt(900000));
/*        Seller newSeller = new Seller();
        newSeller.setEmail(email);
        newSeller.setToken(code);
        sellerRepository.save(newSeller);
        message.setText("Your code is " + code);
        emailSender.send(message);*/
        return ResponseEntity.ok(new EmailVerificationResponse("An Email with verification code has been sent, click Next to proceed."));
    }


/*    @PostMapping("/seller/token/verification")
    public ResponseEntity<EmailVerificationResponse> verifySellerToken(@RequestBody TokenVerificationRequest request) {
        String email = request.getEmail();
        String token = request.getToken();
        Optional<Seller> seller = sellerRepository.findByEmail(email);
        return seller.map(seller1 -> {
            if (Objects.equals(seller1.getToken(), token)){
                return ResponseEntity.ok(new EmailVerificationResponse("Congratulations, your account has been verified"));
            } else {
                return ResponseEntity.badRequest().body(new EmailVerificationResponse("Sorry, your token is not correct"));
            }
        }).orElseThrow(() -> new CustomerNotFoundException(email));
    }*/

/*    @PostMapping("/seller/password")
    public ResponseEntity<EmailVerificationResponse> setSellerPassword(@RequestBody SetPasswordRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Optional<Seller> seller = sellerRepository.findByEmail(email);
        return seller.map(seller1 -> {
            seller1.setPassword(passwordEncoder.encode(password));
            sellerRepository.save(seller1);
            return ResponseEntity.ok(new EmailVerificationResponse("Password set"));
        }).orElseThrow(() -> new CustomerNotFoundException(email));

    }*/

/*    @PostMapping("/seller/login")
    public ResponseEntity<String> sellerLogin(@RequestBody LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Instant now = Instant.now();
        long expiry = 36000L;
        Optional<Seller> seller = sellerRepository.findByEmail(email);
        return seller.map(seller1 -> {
            if (passwordEncoder.matches(password, seller1.getPassword())){
                JwtClaimsSet claims = JwtClaimsSet.builder().issuer("self").issuedAt(now).expiresAt(now.plusSeconds(expiry)).subject(seller1.getEmail()).build();
                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.badRequest().body("Sorry, Password is wrong");
            }
        }).orElseThrow(() -> new SellerNotFoundException(email));

    }*/

/*    @PostMapping("/token/verification")
    public ResponseEntity<String> verifyToken(@RequestParam String email, @RequestParam String token) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        return customer.map(customer1 -> {
            if (Objects.equals(customer1.getToken(), token)){
                return ResponseEntity.ok("Congratulations, your account has been verified");
            } else {
                return ResponseEntity.badRequest().body("Sorry, your token is not correct");
            }
        }).orElseThrow(() -> new CustomerNotFoundException(email));
    }*/

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request){

        return ResponseEntity.ok("Congratulations, you have registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody RegisterRequest request){
        Instant now = Instant.now();
        long expiry = 36000L;
        Optional<Employee> employeeOptional = employeeRepository.findByEmail(request.getEmail());
        return employeeOptional.map(employee -> {
            if (passwordEncoder.matches(request.getPassword(), employee.getPassword())){
                JwtClaimsSet claims = JwtClaimsSet.builder().issuer("self").issuedAt(now).expiresAt(now.plusSeconds(expiry)).subject(employee.getEmail()).build();
                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.badRequest().body("Sorry, Password is wrong");
            }
        }).orElseThrow(() -> new CustomerNotFoundException(request.getEmail()));
    }

    @PostMapping("/seller/login")
    public ResponseEntity<String> sellerLogin(@RequestBody RegisterRequest request){
        Instant now = Instant.now();
        long expiry = 36000L;
        Optional<Employee> employeeOptional = employeeRepository.findByEmail(request.getEmail());
        return employeeOptional.map(employee -> {
            if (passwordEncoder.matches(request.getPassword(), employee.getPassword())){
                JwtClaimsSet claims = JwtClaimsSet.builder().issuer("self").issuedAt(now).expiresAt(now.plusSeconds(expiry)).subject(employee.getEmail()).build();
                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.badRequest().body("Sorry, Password is wrong");
            }
        }).orElseThrow(() -> new CustomerNotFoundException(request.getEmail()));
    }

    @PostMapping("/profile")
    public String getProfile(Authentication authentication){
        return authentication.getName();

    }

}