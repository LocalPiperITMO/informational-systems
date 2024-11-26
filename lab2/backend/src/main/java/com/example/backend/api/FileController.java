package com.example.backend.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.FileRequest;


@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins="http://localhost:5173")
public class FileController {
    
    // GUESS WHO'S BACK, BACK AGAIN
    @PostMapping("/executeScript")
    public String executeScript(@RequestBody FileRequest request) {
        
        return "";
    }
    
}