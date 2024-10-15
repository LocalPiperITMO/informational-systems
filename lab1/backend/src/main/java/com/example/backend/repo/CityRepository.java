package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.City;

public interface CityRepository extends JpaRepository<City, Long>{
    
    City findByName(String name);
}
