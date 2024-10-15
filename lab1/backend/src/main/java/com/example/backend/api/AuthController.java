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
import com.example.backend.dto.request.TokenRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;
import com.example.backend.utils.PasswordHasher;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Login attempt - Username: " + authRequest.getUsername());
        User user = userService.findByUsername(authRequest.getUsername());
        if (user != null) {
            byte[] hashedPassword = PasswordHasher.retrievePassword(authRequest.getPassword(), user.getSalt());
            if (Arrays.equals(hashedPassword, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponse("Login successful for user", authRequest.getUsername(), userService.isAdmin(authRequest.getUsername()), token));
            }
        }
        return ResponseEntity.status(401).body(new AuthResponse("Invalid username/password", null, false, null));
    }

     
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> postMethodName(@RequestBody AuthRequest authRequest) {
        System.out.println("Registration attempt - Username: " + authRequest.getUsername());
        User user = userService.findByUsername(authRequest.getUsername());
        if (user == null) {
            boolean isAdmin = userService.countAllUsers() == 0;
            PasswordHasher.HashedPassword hashedPassword = PasswordHasher.hashPassword(authRequest.getPassword());
            User newUser = new User(authRequest.getUsername(), hashedPassword.getHashedPassword(), hashedPassword.getSalt());
            userService.createUser(newUser);
            if (isAdmin) {
                userService.changeUserRoleToAdmin(authRequest.getUsername());
            }
            String token = jwtUtil.generateToken(newUser.getUsername());
            return ResponseEntity.ok(new AuthResponse("Registration successful for user", authRequest.getUsername(), isAdmin, token));
        }
        return ResponseEntity.status(409).body(new AuthResponse("Username already in use", null, false, null));
    }

    @PostMapping("/validate")
    public ResponseEntity<AuthResponse> validateSession(@RequestBody TokenRequest tokenRequest) {
        String username = jwtUtil.extractUsername(tokenRequest.getToken());
        if (username != null && jwtUtil.validateToken(tokenRequest.getToken(), username)) {
            return ResponseEntity.ok(new AuthResponse("Session is valid", username, userService.isAdmin(username), tokenRequest.getToken()));
        }
        return ResponseEntity.status(401).body(new AuthResponse("Session is invalid", null, false, null));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody TokenRequest userSessionRequest) {
        return ResponseEntity.ok("Session ended");
    }
       
}
