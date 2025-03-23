package com.palette.api.repository;

import com.palette.api.model.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByCustomerId(Long customerId);
}
