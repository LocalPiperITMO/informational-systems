package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.CoordinatesRequest;
import com.example.backend.model.Coordinates;
import com.example.backend.repo.CoordinatesRepository;
import com.example.backend.service.CoordinatesService;

@Service
public class CoordinatesServiceImpl implements CoordinatesService {

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Override
    public List<Coordinates> findAllCoordinates() {
        return coordinatesRepository.findAll();
    }

    @Override
    public Coordinates findCoordinatesById(Long coordinatesId) {
        return (coordinatesRepository.findById(coordinatesId).isPresent())? coordinatesRepository.findById(coordinatesId).get() : null; 
    }

    @Override
    public List<Coordinates> createCoordinates(CoordinatesRequest request) {
        Coordinates coordinates = request.getCoordinates();
        coordinatesRepository.save(coordinates);
        return coordinatesRepository.findAll(); // Return all coordinates after creation
    }

    @Override
    public List<Coordinates> updateCoordinates(CoordinatesRequest request) {
        Coordinates coordinates = request.getCoordinates();
        coordinatesRepository.save(coordinates);
        return coordinatesRepository.findAll(); // Return all coordinates after updating
    }

    @Override
    public List<Coordinates> deleteCoordinates(Long coordinatesId) {
        coordinatesRepository.deleteById(coordinatesId);
        return coordinatesRepository.findAll(); // Return all coordinates after deletion
    }
    
}
