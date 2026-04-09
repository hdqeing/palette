package com.palette.api.controller;

import com.palette.api.dto.*;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Employee;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.service.MailService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

@SecurityRequirement(name = "bearerAuth")

@RequestMapping("/v1/auth")
@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class AuthController {

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    JwtEncoder jwtEncoder;

    @PostMapping("/email")
    public ResponseEntity<String> newEmployee(@RequestBody EmailVerificationRequest request){
        String email = request.getEmail();
        if (employeeRepository.existsByEmail(email)){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This Email has already been registered!");
        } else {
            String verificationCode = String.format("%06d", (new SecureRandom()).nextInt(1_000_000));
            ZonedDateTime expireAt = ZonedDateTime.now(ZoneId.systemDefault()).plusMinutes(30);
            Employee newEmployee = new Employee(email, verificationCode, expireAt);
            employeeRepository.save(newEmployee);
            mailService.sendVerificationCode(newEmployee, verificationCode);
            return ResponseEntity.ok().body("This Email is effective.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> updateEmployee(@RequestBody RegisterRequest request){
        String email = request.getEmail();
        String verificationCode = request.getVerificationCode();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        if (!checkVerificationCode(employee, verificationCode)) {
            return ResponseEntity.badRequest().body("Your verification code is not valid.");
        } else {
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
            employeeRepository.save(employee);
            return ResponseEntity.ok().body("Your password is saved");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpServletResponse response){
        String email = request.getEmail();
        String password = request.getPassword();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));

        if (passwordEncoder.matches(password, employee.getPassword())){
            Instant now = Instant.now();
            long expiry = 36000L;

            JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
            JwtClaimsSet claims = JwtClaimsSet.builder().issuer("self").issuedAt(now).expiresAt(now.plusSeconds(expiry)).subject(employee.getEmail()).build();
            String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

            Cookie jwtCookie = new Cookie("jwt-token", token);
            jwtCookie.setMaxAge((int) expiry); // Cookie expiry matches JWT expiry
            jwtCookie.setPath("/"); // Available for entire application
            jwtCookie.setHttpOnly(true); // Prevents XSS attacks
            // jwtCookie.setSecure(true); // Only send over HTTPS (remove for local development)
            // jwtCookie.setSameSite("Strict"); // Uncomment if using Spring Boot 2.6+ or add manually

            // Add cookie to response
            response.addCookie(jwtCookie);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.badRequest().body("Sorry, Password is wrong");
        }

    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response){

            Cookie jwtCookie = new Cookie("jwt-token", "");
            jwtCookie.setPath("/"); // Available for entire application
            jwtCookie.setHttpOnly(true); // Prevents XSS attacks
            // jwtCookie.setSecure(true); // Only send over HTTPS (remove for local development)
            // jwtCookie.setSameSite("Strict"); // Uncomment if using Spring Boot 2.6+ or add manually

            // Add cookie to response
            response.addCookie(jwtCookie);
            return ResponseEntity.ok().build();
    }

    private boolean checkVerificationCode(Employee employee, String verificationCode) {
        if (ZonedDateTime.now(ZoneId.systemDefault()).isAfter(employee.getExpireAt())) {
            return false;
        }
        return verificationCode.equals(employee.getVerificationCode());
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@CookieValue("jwt-token") String token) {
        try {
            // Decode and validate JWT token
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            // Find employee by email
            Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
            return ResponseEntity.ok(employee);


        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving profile");
        }
    }

}