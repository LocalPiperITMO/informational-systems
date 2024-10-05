package com.example.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.model.User;
import com.example.backend.repo.UserRepository;
import com.example.backend.service.UserService;

public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public long countAllUsers() {
        return userRepository.count();
    }

    @Override
    public void createUser(User user) {
        userRepository.save(user);
    }
    
}
