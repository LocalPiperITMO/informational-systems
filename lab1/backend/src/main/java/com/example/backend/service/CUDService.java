package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.CityRequest;
import com.example.backend.dto.CoordinatesRequest;
import com.example.backend.dto.HumanRequest;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.repo.CityRepository;
import com.example.backend.repo.CoordinatesRepository;
import com.example.backend.repo.HumanRepository;

@Service
public class CUDService {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Autowired
    private HumanRepository humanRepository;

    public List<City> createCity(CityRequest request) {
        City city = request.getCity();
        cityRepository.save(city);
        return cityRepository.findAll(); // Return all cities after creating
    }

    public List<City> updateCity(CityRequest request) {
        City city = request.getCity();
        cityRepository.save(city); // Assuming the ID is set in the city object
        return cityRepository.findAll(); // Return all cities after updating
    }

    public List<City> deleteCity(Long cityId) {
        cityRepository.deleteById(cityId);
        return cityRepository.findAll(); // Return all cities after deletion
    }

    public List<Coordinates> createCoordinates(CoordinatesRequest request) {
        Coordinates coordinates = request.getCoordinates();
        coordinatesRepository.save(coordinates);
        return coordinatesRepository.findAll(); // Return all coordinates after creation
    }

    public List<Coordinates> updateCoordinates(CoordinatesRequest request) {
        Coordinates coordinates = request.getCoordinates();
        coordinatesRepository.save(coordinates);
        return coordinatesRepository.findAll(); // Return all coordinates after updating
    }

    public List<Coordinates> deleteCoordinates(Long coordinatesId) {
        coordinatesRepository.deleteById(coordinatesId);
        return coordinatesRepository.findAll(); // Return all coordinates after deletion
    }

    public List<Human> createHuman(HumanRequest request) {
        Human human = request.getHuman();
        humanRepository.save(human);
        return humanRepository.findAll(); // Return all humans after creation
    }

    public List<Human> updateHuman(HumanRequest request) {
        Human human = request.getHuman();
        humanRepository.save(human);
        return humanRepository.findAll(); // Return all humans after updating
    }

    public List<Human> deleteHuman(Long humanId) {
        humanRepository.deleteById(humanId);
        return humanRepository.findAll(); // Return all humans after deletion
    }
}
