package com.palette.api.service;

import com.palette.api.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MailService {

    @Autowired
    private JavaMailSender emailSender;

    @Async
    public void sendVerificationCode(Employee employee, String code) {
        String email = employee.getEmail();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@mail.palette365.de");
        message.setTo(email);
        message.setSubject("Verification Code");
        message.setText("Your code is " + code);
        emailSender.send(message);
    }

    @Async
    public void sendQueryNotification(Employee employee) {
        String email = employee.getEmail();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@mail.palette365.de");
        message.setTo(email);
        message.setSubject("New Query");
        message.setText("A customer has send a new query to you.");
        emailSender.send(message);
    }


    @Async
    public void sendQuoteNotification(Employee employee) {
        String email = employee.getEmail();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@mail.palette365.de");
        message.setTo(email);
        message.setSubject("New Quote");
        message.setText("A Seller has send a new Quote to you.");
        emailSender.send(message);
    }

}
