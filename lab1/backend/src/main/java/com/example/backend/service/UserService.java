package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserSession;

public interface UserService {
    User findByUsername(String username);
    long countAllUsers();

    void createUser(User user);
    UserSession createUserSession(User user);

    boolean requestAdminChange(String username);
    boolean isAdmin(String username);
    boolean changeUserRoleToAdmin(String username);
}
