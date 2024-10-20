package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Admin;
import com.example.backend.model.User;


public interface AdminRepository extends JpaRepository<Admin, Long>{
    Admin findByUser(User user);
}
