package com.example.backend.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.FileRequest;
import com.example.backend.dto.response.MessageResponse;
import com.example.backend.service.FileProcessingService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;


@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins="http://localhost:5173")
public class FileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FileProcessingService fileProcessingService;

    private boolean checkAuth(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return !(userService.findByUsername(username) == null || !jwtUtil.validateToken(token, username));
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException e) {
            return false;
        }
    }

    // GUESS WHO'S BACK, BACK AGAIN
    @PostMapping("/executeScript")
    public ResponseEntity<Object> executeScript(@RequestBody FileRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(new MessageResponse("Access denied!"));
        fileProcessingService.processFiles(request.getFiles());
        return ResponseEntity.ok(new MessageResponse("Files processed successfully"));
    }
    
}