package com.example.backend.service;

import com.example.backend.model.Admin;
import com.example.backend.model.User;

public interface AdminService {
    void createAdmin(Admin admin);

    Admin findByUser(User user);
}
