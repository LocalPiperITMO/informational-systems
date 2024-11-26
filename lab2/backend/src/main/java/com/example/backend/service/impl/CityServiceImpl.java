package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
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
    public City findCityById(Long cityId) {
        return (cityRepository.findById(cityId).isPresent())? cityRepository.findById(cityId).get() : null; 
    }

    @Override
    public List<City> createCity(City city) {
        cityRepository.save(city);
        return cityRepository.findAll(); // Return all cities after creating
    }

    @Override
    public List<City> updateCity(City newCity, Long cityId) {
        City oldCity = findCityById(cityId);
        oldCity.setName(newCity.getName());
        oldCity.setCoordinates(newCity.getCoordinates());
        oldCity.setCreationDate(newCity.getCreationDate());
        oldCity.setArea(newCity.getArea());
        oldCity.setPopulation(newCity.getPopulation());
        oldCity.setEstablishmentDate(newCity.getEstablishmentDate());
        oldCity.setCapital(newCity.isCapital());
        oldCity.setMetersAboveSeaLevel(newCity.getMetersAboveSeaLevel());
        oldCity.setTelephoneCode(newCity.getTelephoneCode());
        oldCity.setClimate(newCity.getClimate());
        oldCity.setGovernment(newCity.getGovernment());
        oldCity.setGovernor(newCity.getGovernor());
        cityRepository.save(oldCity);
        return cityRepository.findAll();
    }

    @Override
    public List<City> deleteCity(Long cityId) {
        cityRepository.deleteById(cityId);
        return cityRepository.findAll();
    }

    @Override
    public void deleteAllCitiesByCoordinates(Coordinates coordinates) {
        List<City> cities = cityRepository.findByCoordinates(coordinates);
        for (City city : cities) {
            cityRepository.delete(city);
        }
    }
    
    @Override
    public void deleteAllCitiesByGovernor(Human governor) {
        List<City> cities = cityRepository.findByGovernor(governor);
        for (City city : cities) {
            cityRepository.delete(city);
        }
    }
    
}
