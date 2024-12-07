package com.example.backend.jmeter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.AuthRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.model.Admin;
import com.example.backend.model.User;
import com.example.backend.service.AdminService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;
import com.example.backend.utils.PasswordHasher;


@RestController
@RequestMapping("/jmeter")
public class JMeterAuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/createAdmin")
    public ResponseEntity<AuthResponse> createAdmin(@RequestBody AuthRequest request) {
        User user = userService.findByUsername(request.getUsername());
        if (user != null) {
            // login
            Admin admin = adminService.findByUser(user);
            if (admin == null) {
                adminService.createAdmin(new Admin(user));
            }
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Login successful for user", request.getUsername(), true, token));
        }
        // register
        PasswordHasher.HashedPassword hashedPassword = PasswordHasher.hashPassword(request.getPassword());
        user = new User(request.getUsername(), hashedPassword.getHashedPassword(), hashedPassword.getSalt());
        userService.createUser(user);
        adminService.createAdmin(new Admin(user));
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse("Login successful for user", request.getUsername(), true, token));
    }

    @PostMapping("/createUser")
    public ResponseEntity<AuthResponse> createUser(@RequestBody AuthRequest request) {
        User user = userService.findByUsername(request.getUsername());
        if (user != null) {
            // login
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse("Login successful for user", request.getUsername(), false, token));
        }
        // register
        PasswordHasher.HashedPassword hashedPassword = PasswordHasher.hashPassword(request.getPassword());
        user = new User(request.getUsername(), hashedPassword.getHashedPassword(), hashedPassword.getSalt());
        userService.createUser(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse("Login successful for user", request.getUsername(), false, token));
    }
    
}
