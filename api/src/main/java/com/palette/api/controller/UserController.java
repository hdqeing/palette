package com.palette.api.controller;

import com.palette.api.model.User;
import com.palette.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class UserController {

/*    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager){
        this.userService=userService;
        this.authenticationManager = authenticationManager;
    }*/

/*    @PostMapping("/register")
    public String register(User user){
        userService.registerUser(user);
        return "User registered successfully";
    }*/

    @PostMapping("/login")
    public String login(){
        return "Login successfully!";
        //Authentication authentication =  authenticationManager.authenticate(
        //        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        //return authentication.isAuthenticated() ? "Login successful" : "Login failed";
    }
}
