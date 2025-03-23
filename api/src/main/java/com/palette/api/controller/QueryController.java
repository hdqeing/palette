package com.palette.api.controller;

import com.palette.api.model.Query;
import com.palette.api.repository.QueryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QueryController {

    private final QueryRepository repository;


    public QueryController(QueryRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/query")
    Query newQuery(@RequestBody Query newQuery){
        return repository.save(newQuery);
    }

    @GetMapping("/queries/customer/{id}")
    List<Query> getQueriesByCustomer(@PathVariable Long id){
        return repository.findByCustomerId(id);
    }

}
