package com.example.backend.service;

import java.util.List;

import com.example.backend.model.City;

public interface CityService {
    List<City> findAllCities();
    City findCityById(Long cityId);

    List<City> createCity(City city);
    List<City> updateCity(City city, Long cityId);
    List<City> deleteCity(Long cityId);
    
}
