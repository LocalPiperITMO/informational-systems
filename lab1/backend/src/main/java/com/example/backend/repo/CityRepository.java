package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;

public interface CityRepository extends JpaRepository<City, Long>{
    
    City findByName(String name);

    List<City> findByCoordinates(Coordinates coordinates);

    List<City> findByGovernor(Human governor);
}
