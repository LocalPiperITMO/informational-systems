package com.example.backend.service;

import java.util.List;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;

public interface CityService {
    List<City> findAllCities();
    City findCityById(Long cityId);

    City createCity(City city);
    City updateCity(City city, Long cityId);
    void deleteCity(Long cityId);
    
    void deleteAllCitiesByCoordinates(Coordinates coordinates);
    void deleteAllCitiesByGovernor(Human governor);
}
