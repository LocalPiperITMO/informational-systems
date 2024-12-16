package com.example.backend.jmeter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.response.FileResponse;
import com.example.backend.service.FileProcessingService;
import com.example.backend.utils.JwtUtil;

@RestController
@RequestMapping("/jmeter")
public class JMeterFileController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FileProcessingService fileProcessingService;
    
    @PostMapping("/executeScript")
    public ResponseEntity<FileResponse> uploadTomlFile(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwt,
            @RequestParam("file") MultipartFile file) {

        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        
        List<MultipartFile> files = new ArrayList<>();
        files.add(file);
        String username = jwtUtil.extractUsername(jwt.substring(7));

        return ResponseEntity.ok(fileProcessingService.processFiles(files, username));
    }
}
