package com.palette.api.service;

import com.palette.api.dto.BuyerCreateOrderRequest;
import com.palette.api.dto.CreateOrderRequest;
import com.palette.api.dto.UpdateOrderRequest;
import com.palette.api.model.*;
import com.palette.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private QueryRepository queryRepository;
    @Autowired private QuerySellerRepository querySellerRepository;
    @Autowired private CompanyRepository companyRepository;

    // ─── Read ─────────────────────────────────────────────────────────────────

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> findByQueryId(Long queryId) {
        return orderRepository.findByQueryId(queryId);
    }

    public List<Order> findByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public List<Order> findBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public Result<Order> create(CreateOrderRequest req) {
        // Validate query exists and is not already linked to an order
        Query query = queryRepository.findById(req.queryId()).orElse(null);
        if (query == null) {
            return Result.error("Query not found: id=" + req.queryId());
        }
        if (orderRepository.findByQueryId(req.queryId()).isPresent()) {
            return Result.error("An order already exists for query id=" + req.queryId());
        }

        Company seller = companyRepository.findById(req.sellerId()).orElse(null);
        if (seller == null) {
            return Result.error("Seller not found: id=" + req.sellerId());
        }

        Company buyer = companyRepository.findById(req.buyerId()).orElse(null);
        if (buyer == null) {
            return Result.error("Buyer not found: id=" + req.buyerId());
        }

        Order order = new Order();
        order.setQuery(query);
        order.setSeller(seller);
        order.setBuyer(buyer);
        order.setTotalPrice(req.totalPrice());
        order.setCreatedAt(ZonedDateTime.now());
        order.setDeliveryDate(req.deliveryDate());
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryAddress(req.deliveryAddress());

        return Result.ok(orderRepository.save(order));
    }

    /**
     * Buyer-initiated order creation. Derives the seller and total price
     * from the accepted QuerySeller entry, so the buyer only needs to provide
     * the queryId and delivery details.
     */
    public Result<Order> createForBuyer(BuyerCreateOrderRequest req, Company buyer) {
        Query query = queryRepository.findById(req.queryId()).orElse(null);
        if (query == null) {
            return Result.error("Query not found: id=" + req.queryId());
        }
        if (!query.getBuyer().getId().equals(buyer.getId())) {
            return Result.error("This query does not belong to your company");
        }
        if (orderRepository.findByQueryId(req.queryId()).isPresent()) {
            return Result.error("An order already exists for this query");
        }

        // Find the accepted seller for this query
        QuerySeller accepted = querySellerRepository.findByQueryId(req.queryId())
                .stream()
                .filter(QuerySeller::isAccepted)
                .findFirst()
                .orElse(null);
        if (accepted == null) {
            return Result.error("No accepted seller found for this query");
        }

        Order order = new Order();
        order.setQuery(query);
        order.setSeller(accepted.getSeller());
        order.setBuyer(buyer);
        order.setTotalPrice(accepted.getSum());
        order.setCreatedAt(ZonedDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        return Result.ok(orderRepository.save(order));
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public Result<Order> update(Long id, UpdateOrderRequest req) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return Result.error("Order not found: id=" + id);
        }

        if (req.status() != null) {
            order.setStatus(req.status());
        }
        if (req.deliveryDate() != null) {
            order.setDeliveryDate(req.deliveryDate());
        }
        if (req.deliveryAddress() != null) {
            order.setDeliveryAddress(req.deliveryAddress());
        }
        if (req.totalPrice() != null) {
            order.setTotalPrice(req.totalPrice());
        }

        return Result.ok(orderRepository.save(order));
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    public boolean delete(Long id) {
        if (!orderRepository.existsById(id)) {
            return false;
        }
        orderRepository.deleteById(id);
        return true;
    }

    // ─── Simple result wrapper ────────────────────────────────────────────────

    public record Result<T>(T value, String error) {
        public static <T> Result<T> ok(T value) { return new Result<>(value, null); }
        public static <T> Result<T> error(String msg) { return new Result<>(null, msg); }
        public boolean isError() { return error != null; }
    }
}