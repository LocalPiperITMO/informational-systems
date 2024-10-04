package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
    User findByUsername(String username);
}
