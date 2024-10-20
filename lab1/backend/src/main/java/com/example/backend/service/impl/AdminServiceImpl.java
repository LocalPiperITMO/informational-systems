package com.example.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Admin;
import com.example.backend.model.User;
import com.example.backend.repo.AdminRepository;
import com.example.backend.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void createAdmin(Admin admin) {
        adminRepository.save(admin);
    }

    @Override
    public Admin findByUser(User user) {
        return adminRepository.findByUser(user);
    }
}
