//package com.palette.api.controller;
//
//import org.apache.catalina.User;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RequestMapping("/auth")
//@RestController
//public class AuthController {
//    @PostMapping("/signup")
//    public ResponseEntity<User> register(){
//        User registeredUser = authenticationService.signup();
//        return ResponseEntity.ok(registeredUser);
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<LoginResponse> authenticate(){
//        User authenticatedUser = authenticationService.authenticate();
//        String jwtToken = jwtService.generateToken(authenticatedUser);
//        LoginResponse loginResponse = new LoginResponse().serToken(jwtToken).setExpiresIn();
//        return ResponseEntity.ok(LoginResponse);
//    }
//}
