package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserSession;

public interface UserService {
    User findByUsername(String username);
    User findById(Long id);
    long countAllUsers();

    void createUser(User user);
    UserSession createUserSession(User user);
    UserSession validateUserSession(String sessionId);

    boolean requestAdminChange(String username);
    boolean isAdmin(String username);
    boolean changeUserRoleToAdmin(String username);
    
}
