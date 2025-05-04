package com.palette.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private JavaMailSender emailSender;

    @PostMapping("/email/verification")
    public ResponseEntity<String> verifyEmail(@RequestParam String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("auth@palette365.de");
        message.setTo(email);
        message.setSubject("Verification Code");
        Random random = new Random();
        String code = String.valueOf(100000 + random.nextInt(900000));
        message.setText("Your code is " + code);
        emailSender.send(message);
        return ResponseEntity.ok("An Email with verification code has been sent, click Next to proceed.");
    }

}
