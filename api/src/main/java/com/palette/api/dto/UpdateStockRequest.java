package com.palette.api.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UpdateStockRequest {
    private Long paletteId;
    private int quantity;
    private double price;
    private List<Long> keepPhotoIds;

    // getters and setters
}