package com.example.backend.api;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.AuthRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.utils.PasswordHasher;
import com.example.backend.validation.AuthValidator;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Login attempt - Username: " + authRequest.getUsername());
        User user = userService.findByUsername(authRequest.getUsername());
        if (user != null) {
            byte[] hashedPassword = PasswordHasher.retrievePassword(authRequest.getPassword(), user.getSalt());
            if (Arrays.equals(hashedPassword, user.getPassword())) {
                return ResponseEntity.ok(new AuthResponse("Login successful for user", authRequest.getUsername(), user.isAdmin()));
            }
        }
        return ResponseEntity.status(401).body(new AuthResponse("Invalid username/password", null, false));
    }
     
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> postMethodName(@RequestBody AuthRequest authRequest) {
        System.out.println("Registration attempt - Username: " + authRequest.getUsername());
        User user = userService.findByUsername(authRequest.getUsername());
        if (user == null) {
            if (!AuthValidator.validateUsername(authRequest.getUsername()) || !AuthValidator.validatePassword(authRequest.getPassword())) {
                return ResponseEntity.status(422).body(new AuthResponse("User data did not pass validation", null, false));
            }
            boolean isAdmin = userService.countAllUsers() == 0;
            PasswordHasher.HashedPassword hashedPassword = PasswordHasher.hashPassword(authRequest.getPassword());
            User newUser = new User(authRequest.getUsername(), hashedPassword.getHashedPassword(), hashedPassword.getSalt(), isAdmin);
            userService.createUser(newUser);
            return ResponseEntity.ok(new AuthResponse("Registration successful for user", authRequest.getUsername(), isAdmin));
        }
        return ResponseEntity.status(409).body(new AuthResponse("Username already in use", null, false));
    }
}
