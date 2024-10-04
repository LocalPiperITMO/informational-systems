package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.CityRequest;
import com.example.backend.model.City;
import com.example.backend.repo.CityRepository;
import com.example.backend.service.CityService;


@Service
public class CityServiceImpl implements CityService{

    @Autowired
    private CityRepository cityRepository;

    @Override
    public List<City> findAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public List<City> createCity(CityRequest request) {
        City city = request.getCity();
        cityRepository.save(city);
        return cityRepository.findAll(); // Return all cities after creating
    }

    @Override
    public List<City> updateCity(CityRequest request) {
        City city = request.getCity();
        cityRepository.save(city); // Assuming the ID is set in the city object
        return cityRepository.findAll(); // Return all cities after updating
    }

    @Override
    public List<City> deleteCity(Long cityId) {
        cityRepository.deleteById(cityId);
        return cityRepository.findAll(); // Return all cities after deletion
    }
    
}
