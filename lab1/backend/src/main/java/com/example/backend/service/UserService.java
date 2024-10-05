package com.example.backend.service;

import com.example.backend.model.User;

public interface UserService {
    User findByUsername(String username);
    long countAllUsers();

    void createUser(User user);
}
