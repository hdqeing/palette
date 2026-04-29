package com.palette.api.controller;

import com.palette.api.dto.UpdateCartItemRequest;
import com.palette.api.dto.UpdateCartRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Cart;
import com.palette.api.model.Company;
import com.palette.api.model.Employee;
import com.palette.api.model.Pallet;
import com.palette.api.repository.CartRepository;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.PalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/v1/carts")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private JwtDecoder jwtDecoder;

    @GetMapping
    public ResponseEntity<?> getCartItems(
            @CookieValue(value = "jwt-token", required = false) String token
    ) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing token");
            }

            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));

            Company company = employee.getCompany();
            if (company == null) {
                return ResponseEntity.badRequest().body("Employee has no company");
            }

            List<Cart> cartItems = cartRepository.findByOwnerId(company.getId());
            return ResponseEntity.ok(cartItems);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving cart items");
        }
    }

    @PutMapping
    public ResponseEntity<?> replaceCart(
            @CookieValue(value = "jwt-token", required = false) String token,
            @RequestBody UpdateCartRequest request
    ) {
        try {
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing token");
            }

            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getSubject();

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new EmployeeNotFoundException(email));

            Company company = employee.getCompany();
            if (company == null) {
                return ResponseEntity.badRequest().body("Employee has no company");
            }

            List<UpdateCartItemRequest> items = request.getItems();
            if (items == null) {
                return ResponseEntity.badRequest().body("Items are required");
            }

            cartRepository.deleteByOwnerId(company.getId());

            List<Cart> cartsToSave = new ArrayList<>();

            for (UpdateCartItemRequest item : items) {
                if (item.getPalletId() == null) {
                    return ResponseEntity.badRequest().body("Pallet id is required for every item");
                }

                if (item.getQuantity() == null) {
                    return ResponseEntity.badRequest().body("Quantity is required for every item");
                }

                if (item.getQuantity() <= 0) {
                    continue;
                }

                Pallet pallet = palletRepository.findById(item.getPalletId())
                        .orElseThrow(() -> new IllegalArgumentException("Pallet not found: " + item.getPalletId()));

                Cart cart = new Cart();
                cart.setOwner(company);
                cart.setPallet(pallet);
                cart.setQuantity(item.getQuantity());

                cartsToSave.add(cart);
            }

            List<Cart> savedCartItems = cartRepository.saveAll(cartsToSave);
            return ResponseEntity.ok(savedCartItems);

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // or use a logger
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage()); // expose the real message temporarily
        }
    }
}