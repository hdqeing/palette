package com.palette.api.controller;

import com.palette.api.model.PalletCategory;
import com.palette.api.repository.PalletCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PalletCategoryController {

    private final PalletCategoryRepository palletCategoryRepository;

    public PalletCategoryController(PalletCategoryRepository palletCategoryRepository) {
        this.palletCategoryRepository = palletCategoryRepository;
    }

    @PostMapping("/category")
    PalletCategory newCategory(@RequestBody PalletCategory newCategory){
        return palletCategoryRepository.save(newCategory);
    }

    @GetMapping("/categories")
    List<PalletCategory> allPalletCategories(){
        return palletCategoryRepository.findAll();
    }


}
