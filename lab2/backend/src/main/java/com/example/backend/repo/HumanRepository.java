package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Human;

public interface HumanRepository extends JpaRepository<Human, Long>{
    
}
