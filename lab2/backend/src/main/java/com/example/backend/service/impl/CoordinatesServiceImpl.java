package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Coordinates createCoordinates(Coordinates coordinates) {
        coordinatesRepository.save(coordinates);
        return coordinates;
    }

    @Override
    public Coordinates updateCoordinates(Coordinates newCoordinates, Long id) {
        Coordinates oldCoordinates = findCoordinatesById(id);
        oldCoordinates.setX(newCoordinates.getX());
        oldCoordinates.setY(newCoordinates.getY());
        coordinatesRepository.save(oldCoordinates);
        return oldCoordinates;
    }

    @Override
    public void deleteCoordinates(Long coordinatesId) {
        coordinatesRepository.deleteById(coordinatesId);
    }
    
}
