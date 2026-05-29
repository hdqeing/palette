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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestBody EmailVerificationRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (request.getVerificationCode() == null || request.getVerificationCode().isBlank()) {
            return ResponseEntity.badRequest().body("Verification code is required");
        }

        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EmployeeNotFoundException(request.getEmail()));

        if (employee.getVerificationCode() == null || employee.getExpireAt() == null) {
            return ResponseEntity.badRequest().body("No verification code available");
        }

        if (employee.getExpireAt().isBefore(ZonedDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification code expired");
        }

        if (!employee.getVerificationCode().equals(request.getVerificationCode())) {
            return ResponseEntity.badRequest().body("Verification code is incorrect");
        }

        return ResponseEntity.ok("Verification successful");
    }

    @PostMapping("/register")
    public ResponseEntity<?> updateEmployee(@RequestBody RegisterRequest request, HttpServletResponse response) {
        String email = request.getEmail();
        String verificationCode = request.getVerificationCode();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException(email));

        if (!checkVerificationCode(employee, verificationCode)) {
            return ResponseEntity.badRequest().body("Your verification code is not valid.");
        }

        // Validate password policy before encoding
        if (!isPasswordValid(request.getPassword())) {
            return ResponseEntity.badRequest().body("Password does not meet requirements.");
        }

        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        Employee newEmployee = employeeRepository.save(employee);

        // Issue JWT cookie so the profile step is authenticated
        Instant now = Instant.now();
        long expiry = 36000L;
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(employee.getEmail())
                .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        Cookie jwtCookie = new Cookie("jwt-token", token);
        jwtCookie.setMaxAge((int) expiry);
        jwtCookie.setPath("/");
        jwtCookie.setHttpOnly(true);
        response.addCookie(jwtCookie);

        return ResponseEntity.ok().body(newEmployee);
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

    private boolean isPasswordValid(String password) {
        if (password == null || password.length() < 8) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        if (!password.matches(".*[a-z].*")) return false;
        if (!password.matches(".*[0-9].*")) return false;
        if (!password.matches(".*[^A-Za-z0-9].*")) return false;
        return true;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@CookieValue(value = "jwt-token", required = false) String token) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
            }

            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));

            return ResponseEntity.ok(new EmployeeProfileResponse(employee));

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        } catch (EmployeeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error");
        }
    }

    @PostMapping("/send-reset-code")
    public ResponseEntity<String> sendResetCode(@RequestBody EmailVerificationRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        // Look up silently — don't reveal whether the account exists
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(request.getEmail());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.ok("If this email is registered, a reset code has been sent");
        }

        Employee employee = employeeOpt.get();

        // Generate a new 6-digit code and store it with a 15-minute expiry
        String code = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        employee.setVerificationCode(code);
        employee.setExpireAt(ZonedDateTime.now().plusMinutes(15));
        employeeRepository.save(employee);

        mailService.sendVerificationCode(employee, code);

        return ResponseEntity.ok("If this email is registered, a reset code has been sent");
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EmployeeNotFoundException(request.getEmail()));

        if (!checkVerificationCode(employee, request.getVerificationCode())) {
            return ResponseEntity.badRequest().body("Verification code is invalid or expired");
        }

        if (!isPasswordValid(request.getNewPassword())) {
            return ResponseEntity.badRequest().body("Password does not meet requirements");
        }

        employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
        // Invalidate the code so it can't be reused
        employee.setVerificationCode(null);
        employee.setExpireAt(null);
        employeeRepository.save(employee);

        return ResponseEntity.ok("Password reset successfully");
    }

}