package com.example.backend.repo;

import org.springframework.data.repository.CrudRepository;

import com.example.backend.model.City;

public interface CityRepository extends CrudRepository<City, Long>{
    
    City findByName(String name);
}
