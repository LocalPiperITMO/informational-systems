package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.RequestRole;
import com.example.backend.model.User;

public interface RequestRoleRepository extends JpaRepository<RequestRole, Long>{
    RequestRole findByUser(User user);
}
