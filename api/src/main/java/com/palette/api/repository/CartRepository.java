package com.palette.api.repository;

import com.palette.api.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByOwnerId(Long ownerId);

    @Transactional
    @Modifying
    void deleteByOwnerId(Long ownerId);

    Optional<Cart> findByOwnerIdAndPalletId(Long ownerId, Long palletId);

    void deleteByOwnerIdAndPalletId(Long ownerId, Long palletId);
}