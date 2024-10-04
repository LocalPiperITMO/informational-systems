package com.example.backend.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.model.User;
import com.example.backend.repo.UserRepository;
import com.example.backend.utils.PasswordHasher;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Login attempt - Username: " + authRequest.getUsername());
        User user = userRepository.findByUsername(authRequest.getUsername());
        if (user != null) {
            String hashedPassword = PasswordHasher.retrievePassword(authRequest.getPassword(), user.getSalt().getBytes());
            if (hashedPassword.equals(user.getPassword())) {
                return ResponseEntity.ok(new AuthResponse("Login successful for user", authRequest.getUsername()));
            }
        }
        return ResponseEntity.status(401).body(new AuthResponse("Invalid username/password", authRequest.getUsername()));
    }
     
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> postMethodName(@RequestBody AuthRequest authRequest) {
        System.out.println("Registration attempt - Username: " + authRequest.getUsername());
        User user = userRepository.findByUsername(authRequest.getUsername());
        if (user == null) {
            PasswordHasher.HashedPassword hashedPassword = PasswordHasher.hashPassword(authRequest.getPassword());
            User newUser = new User(authRequest.getUsername(), hashedPassword.getHashedPassword(), hashedPassword.getSalt());
            userRepository.save(newUser);
            return ResponseEntity.ok(new AuthResponse("Registration successful for user", authRequest.getUsername()));
        }
        return ResponseEntity.status(409).body(new AuthResponse("Username already in use", authRequest.getUsername()));
    }
}
