package com.palette.api.repository;

import com.palette.api.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByOwnerId(Long ownerId);

    @Transactional
    @Modifying
    void deleteByOwnerId(Long ownerId);
}