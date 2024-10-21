package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.RoleApprovalRequest;
import com.example.backend.dto.request.TokenRequest;
import com.example.backend.dto.response.MessageResponse;
import com.example.backend.dto.response.RoleRequestsResponse;
import com.example.backend.model.RequestRole;
import com.example.backend.model.User;
import com.example.backend.service.AdminService;
import com.example.backend.service.RequestRoleService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;
import com.example.backend.utils.Verdict;

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
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(new MessageResponse("Access denied!"));
        User user = userService.findByUsername(jwtUtil.extractUsername(request.getToken()));
        if (adminService.findByUser(user) != null) return ResponseEntity.status(422).body(new MessageResponse("User is already admin"));
        if (requestRoleService.findRequest(user) == null) {
            RequestRole requestRole = new RequestRole(user);
            requestRoleService.addNewRequest(requestRole);
        }
        return ResponseEntity.ok(new MessageResponse("Request added successfully"));
    }
    
    @PostMapping("/fetchRequests")
    public ResponseEntity<RoleRequestsResponse> getRequests(
    @Valid    
    @RequestBody TokenRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        if (userService.findByUsername(jwtUtil.extractUsername(request.getToken())) == null || 
        adminService.findByUser(
            userService.findByUsername(
                jwtUtil.extractUsername(
                    request.getToken()))) == null) {
                        return ResponseEntity.status(422).body(null);
        }
        List<RequestRole> requests = requestRoleService.getAllRequests();

        return ResponseEntity.ok(new RoleRequestsResponse(requests));
    }

    @PostMapping("/applyRoles")
    public ResponseEntity<Object> processRequests(
        @Valid
        @RequestBody RoleApprovalRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        if (userService.findByUsername(jwtUtil.extractUsername(request.getToken())) == null || 
        adminService.findByUser(
            userService.findByUsername(
                jwtUtil.extractUsername(
                    request.getToken()))) == null) {
                        return ResponseEntity.status(422).body(null);
                    }
        for (Verdict v : request.getVerdicts()) {
            User user = userService.findByUsername(v.getUsername());
            if (user == null || adminService.findByUser(user) != null) continue;
            if ("approved".equals(v.getStatus())) {
                userService.changeUserRoleToAdmin(v.getUsername());
            }
            requestRoleService.deleteRequest(requestRoleService.findRequest(user));
        }
        return ResponseEntity.ok(new MessageResponse("Requests processed"));
    }
    
    
}
