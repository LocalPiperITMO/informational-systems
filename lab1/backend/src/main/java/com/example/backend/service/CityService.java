package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.request.CityRequest;
import com.example.backend.model.City;

public interface CityService {
    List<City> findAllCities();

    List<City> createCity(CityRequest request);
    List<City> updateCity(CityRequest request);
    List<City> deleteCity(Long cityId);
    
}
