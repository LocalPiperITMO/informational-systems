package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Admin;
import com.example.backend.model.User;


public interface AdminRepository extends JpaRepository<Admin, Long>{
    List<Admin> findByUser(User user);
}
