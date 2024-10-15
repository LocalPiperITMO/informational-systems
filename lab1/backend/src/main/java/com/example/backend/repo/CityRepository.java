package com.example.backend.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.City;

public interface CityRepository extends JpaRepository<City, Integer>{
    
    City findByName(String name);

    void deleteById(Long cityId);

    Optional<City> findById(Long cityId);
}
