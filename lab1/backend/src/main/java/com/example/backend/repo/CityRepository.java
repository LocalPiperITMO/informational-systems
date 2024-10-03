package com.example.backend.repo;

import org.springframework.data.repository.CrudRepository;

import com.example.backend.model.City;

public interface CityRepository extends CrudRepository<City, Integer>{
    
    City findByName(String name);
}
