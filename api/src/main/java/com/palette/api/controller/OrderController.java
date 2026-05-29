package com.palette.api.controller;

import com.palette.api.dto.BuyerCreateOrderRequest;
import com.palette.api.dto.OrderResponse;
import com.palette.api.dto.UpdateOrderRequest;
import com.palette.api.model.*;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Order endpoints for buyers (customers) and sellers.
 * Secured by the local HS256 cookie JWT.
 * Each user only sees orders that belong to their company.
 */
@RestController
@RequestMapping("/v1")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private JwtDecoder jwtDecoder;

    /**
     * POST /v1/buyer/orders
     * Creates an order from a completed query. The seller and total price are
     * derived automatically from the accepted QuerySeller — the buyer only
     * needs to supply queryId and delivery details.
     */
    @PostMapping("/buyer/orders")
    public ResponseEntity<?> createOrder(
            @CookieValue(value = "jwt-token", required = false) String token,
            @RequestBody BuyerCreateOrderRequest req
    ) {
        try {
            Company buyer = companyFromToken(token);
            OrderService.Result<Order> result = orderService.createForBuyer(req, buyer);
            if (result.isError()) {
                return ResponseEntity.badRequest().body(result.error());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.from(result.value()));
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // ─── Buyer endpoints ──────────────────────────────────────────────────────

    /**
     * GET /v1/buyer/orders
     * Returns all orders where the authenticated employee's company is the buyer.
     */
    @GetMapping("/buyer/orders")
    public ResponseEntity<?> getBuyerOrders(@CookieValue(value = "jwt-token", required = false) String token) {
        try {
            Company buyer = companyFromToken(token);
            List<OrderResponse> orders = orderService.findByBuyer(buyer.getId()).stream()
                    .map(OrderResponse::from)
                    .toList();
            return ResponseEntity.ok(orders);
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    /**
     * GET /v1/buyer/orders/{id}
     * Returns a specific order only if the authenticated employee's company is the buyer.
     */
    @GetMapping("/buyer/orders/{id}")
    public ResponseEntity<?> getBuyerOrder(
            @CookieValue(value = "jwt-token", required = false) String token,
            @PathVariable Long id
    ) {
        try {
            Company buyer = companyFromToken(token);
            Order order = orderService.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: id=" + id);
            }
            if (!order.getBuyer().getId().equals(buyer.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    /**
     * GET /v1/buyer/orders/query/{queryId}
     * Returns the order associated with the given query, only if the
     * authenticated employee's company is the buyer on that order.
     */
    @GetMapping("/buyer/orders/query/{queryId}")
    public ResponseEntity<?> getBuyerOrderByQueryId(
            @CookieValue(value = "jwt-token", required = false) String token,
            @PathVariable Long queryId
    ) {
        try {
            Company buyer = companyFromToken(token);
            Order order = orderService.findByQueryId(queryId).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found for queryId=" + queryId);
            }
            if (!order.getBuyer().getId().equals(buyer.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // ─── Seller endpoints ─────────────────────────────────────────────────────

    /**
     * GET /v1/seller/orders
     * Returns all orders where the authenticated employee's company is the seller.
     */
    @GetMapping("/seller/orders")
    public ResponseEntity<?> getSellerOrders(@CookieValue(value = "jwt-token", required = false) String token) {
        try {
            Company seller = companyFromToken(token);
            List<OrderResponse> orders = orderService.findBySeller(seller.getId()).stream()
                    .map(OrderResponse::from)
                    .toList();
            return ResponseEntity.ok(orders);
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    /**
     * GET /v1/seller/orders/{id}
     * Returns a specific order only if the authenticated employee's company is the seller.
     */
    @GetMapping("/seller/orders/{id}")
    public ResponseEntity<?> getSellerOrder(
            @CookieValue(value = "jwt-token", required = false) String token,
            @PathVariable Long id
    ) {
        try {
            Company seller = companyFromToken(token);
            Order order = orderService.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: id=" + id);
            }
            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    /**
     * PUT /v1/seller/orders/{id}/status
     * Allows a seller to advance the order status (e.g. CONFIRMED → SHIPPED → DELIVERED).
     * Only the seller assigned to the order may update it.
     */
    @PutMapping("/seller/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @CookieValue(value = "jwt-token", required = false) String token,
            @PathVariable Long id,
            @RequestBody UpdateOrderRequest req
    ) {
        try {
            Company seller = companyFromToken(token);
            Order order = orderService.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: id=" + id);
            }
            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            OrderService.Result<Order> result = orderService.update(id, req);
            if (result.isError()) {
                return ResponseEntity.badRequest().body(result.error());
            }
            return ResponseEntity.ok(OrderResponse.from(result.value()));
        } catch (AuthException e) {
            return e.toResponse();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Company companyFromToken(String token) throws AuthException {
        if (token == null || token.isBlank()) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Missing token");
        }
        try {
            String email = jwtDecoder.decode(token).getSubject();
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Employee not found"));
            Company company = employee.getCompany();
            if (company == null) {
                throw new AuthException(HttpStatus.FORBIDDEN, "Employee has no associated company");
            }
            return company;
        } catch (JwtException e) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
    }

    private static class AuthException extends Exception {
        private final HttpStatus status;
        AuthException(HttpStatus status, String message) {
            super(message);
            this.status = status;
        }
        ResponseEntity<String> toResponse() {
            return ResponseEntity.status(status).body(getMessage());
        }
    }
}