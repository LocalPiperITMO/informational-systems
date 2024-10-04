package com.example.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
     @PostMapping("/login")
     public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
         //TODO: process POST request
         
        System.out.println("Login attempt - Username: " + authRequest.getUsername());
        return ResponseEntity.ok(new AuthResponse("Login successful for user", authRequest.getUsername()));
     }
     
     @PostMapping("/register")
     public ResponseEntity<AuthResponse> postMethodName(@RequestBody AuthRequest authRequest) {
         //TODO: process POST request

         System.out.println("Registration attempt - Username: " + authRequest.getUsername());
         return ResponseEntity.ok(new AuthResponse("Registration successful for user", authRequest.getUsername()));
     }
     
}
