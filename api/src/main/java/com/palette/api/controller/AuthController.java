package com.palette.api.controller;

import com.palette.api.exception.CustomerNotFoundException;
import com.palette.api.model.Customer;
import com.palette.api.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Optional;
import java.util.Random;

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private JavaMailSender emailSender;

    private final CustomerRepository customerRepository;

    public AuthController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @PostMapping("/email/verification")
    public ResponseEntity<String> verifyEmail(@RequestParam String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("auth@palette365.de");
        message.setTo(email);
        message.setSubject("Verification Code");
        Random random = new Random();
        String code = String.valueOf(100000 + random.nextInt(900000));
        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);
        newCustomer.setToken(code);
        customerRepository.save(newCustomer);
        message.setText("Your code is " + code);
        emailSender.send(message);
        return ResponseEntity.ok("An Email with verification code has been sent, click Next to proceed.");
    }

    @PostMapping("/token/verification")
    public ResponseEntity<String> verifyToken(@RequestParam String email, @RequestParam String token) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        return customer.map(customer1 -> {
            if (Objects.equals(customer1.getToken(), token)){
                return ResponseEntity.ok("Congratulations, your account has been verified");
            } else {
                return ResponseEntity.badRequest().body("Sorry, your token is not correct");
            }
        }).orElseThrow(() -> new CustomerNotFoundException(email));
    }

}
