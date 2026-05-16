package com.palette.api.controller;

import com.palette.api.dto.CreateOrderRequest;
import com.palette.api.dto.OrderResponse;
import com.palette.api.dto.UpdateOrderRequest;
import com.palette.api.model.*;
import com.palette.api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only order endpoints secured by Entra ID.
 * All routes under /v1/admin/** require SCOPE_access_as_admin,
 * enforced globally in SecurityConfig.
 */
@RestController
@RequestMapping("/v1/admin/orders")
public class AdminOrderController {

    @Autowired private OrderService orderService;

    // ─── GET ──────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        List<OrderResponse> orders = orderService.findAll().stream()
                .map(OrderResponse::from)
                .toList();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return orderService.findById(id)
                .<ResponseEntity<?>>map(o -> ResponseEntity.ok(OrderResponse.from(o)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: id=" + id));
    }

    @GetMapping("/by-query/{queryId}")
    public ResponseEntity<?> getByQuery(@PathVariable Long queryId) {
        return orderService.findByQueryId(queryId)
                .<ResponseEntity<?>>map(o -> ResponseEntity.ok(OrderResponse.from(o)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order for query id=" + queryId));
    }

    @GetMapping("/by-buyer/{buyerId}")
    public ResponseEntity<List<OrderResponse>> getByBuyer(@PathVariable Long buyerId) {
        List<OrderResponse> orders = orderService.findByBuyer(buyerId).stream()
                .map(OrderResponse::from)
                .toList();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/by-seller/{sellerId}")
    public ResponseEntity<List<OrderResponse>> getBySeller(@PathVariable Long sellerId) {
        List<OrderResponse> orders = orderService.findBySeller(sellerId).stream()
                .map(OrderResponse::from)
                .toList();
        return ResponseEntity.ok(orders);
    }

    // ─── POST ─────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateOrderRequest req) {
        OrderService.Result<Order> result = orderService.create(req);
        if (result.isError()) {
            return ResponseEntity.badRequest().body(result.error());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.from(result.value()));
    }

    // ─── PUT ──────────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateOrderRequest req) {
        OrderService.Result<Order> result = orderService.update(id, req);
        if (result.isError()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result.error());
        }
        return ResponseEntity.ok(OrderResponse.from(result.value()));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!orderService.delete(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: id=" + id);
        }
        return ResponseEntity.noContent().build();
    }
}