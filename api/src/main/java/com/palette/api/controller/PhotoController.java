package com.palette.api.controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.palette.api.dto.CreatePhotoRequest;
import com.palette.api.exception.EmployeeNotFoundException;
import com.palette.api.model.Company;
import com.palette.api.model.Employee;
import com.palette.api.model.Photo;
import com.palette.api.repository.EmployeeRepository;
import com.palette.api.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/v1/photos")
public class PhotoController {

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Value("${azure.storage.connection-string}")
    private String connString;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Photo> newPhoto(@CookieValue("jwt-token") String token, @RequestParam("file") MultipartFile file) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        // Find employee by email
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();

        String filename = seller.getTitle() + UUID.randomUUID() + file.getOriginalFilename();
        BlobClient client = (new BlobClientBuilder()).connectionString(connString).endpoint("https://palletly.blob.core.windows.net").containerName("pallet-images").blobName(filename).buildClient();
        Photo newPhoto = new Photo();
        try {
            client.upload(file.getInputStream());
            newPhoto.setBlobName(filename);
            newPhoto.setOwner(seller);
            photoRepository.save(newPhoto);
        } catch (IOException e){}
        return ResponseEntity.ok(newPhoto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long photoId, @CookieValue("jwt-token") String token) {
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();

        // Find employee by email
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new EmployeeNotFoundException(email));
        Company seller = employee.getCompany();

        Photo photo = photoRepository.findById(photoId).orElseThrow();
        if (photo.getOwner() != seller){
            return ResponseEntity.badRequest().body("You are not allowed to delete this photo.");
        }
        BlobClient client = (new BlobClientBuilder()).connectionString(connString).endpoint("https://palletly.blob.core.windows.net").containerName("pallet-images").blobName(photo.getBlobName()).buildClient();
        client.delete();
        photoRepository.delete(photo);
        return ResponseEntity.ok("Photo deleted!");
    }
}
