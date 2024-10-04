package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Coordinates;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Long>{
    
}
