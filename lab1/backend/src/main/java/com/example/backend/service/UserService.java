package com.example.backend.service;

import com.example.backend.model.User;

public interface UserService {
    User findByUsername(String username);
    User findById(Long id);
    long countAllUsers();

    void createUser(User user);

    boolean requestAdminChange(String username);
    boolean isAdmin(String username);
    boolean changeUserRoleToAdmin(String username);
    
}
