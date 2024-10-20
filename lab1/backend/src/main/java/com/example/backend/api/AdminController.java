package com.example.backend.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.TokenRequest;
import com.example.backend.model.RequestRole;
import com.example.backend.model.User;
import com.example.backend.service.AdminService;
import com.example.backend.service.RequestRoleService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

    @Autowired
    private RequestRoleService requestRoleService;

    private boolean checkAuth(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return !(userService.findByUsername(username) == null || !jwtUtil.validateToken(token, username));
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException e) {
            return false;
        }
    }

    @PostMapping("/requestAdmin")
    public ResponseEntity<Object> requestAdmin(
    @Valid
    @RequestBody TokenRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body("Access denied!");
        User user = userService.findByUsername(jwtUtil.extractUsername(request.getToken()));
        if (adminService.findByUser(user) != null) return ResponseEntity.status(422).body("User is already admin");
        if (requestRoleService.findRequest(user) == null) {
            RequestRole requestRole = new RequestRole(user);
            requestRoleService.addNewRequest(requestRole);
        }
        return ResponseEntity.ok("Request added successfully");
    }
    
}
