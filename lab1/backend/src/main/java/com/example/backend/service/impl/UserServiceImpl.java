package com.example.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Admin;
import com.example.backend.model.User;
import com.example.backend.repo.AdminRepository;
import com.example.backend.repo.UserRepository;
import com.example.backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

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

    @Override
    public boolean requestAdminChange(String username) {
        // Logic to record the request in the admin requests table
        // This could involve saving a new record to an "AdminRequest" entity/table
        return true; // Return true if the request was recorded successfully

    }

    @Override
    public boolean isAdmin(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        Admin admin = adminRepository.findByUser(user);
        return admin != null;
    }


    @Override
    public boolean changeUserRoleToAdmin(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            Admin admin = new Admin(user);
            adminRepository.save(admin);
            return true;
        }
        return false;
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).get();
    }
}
