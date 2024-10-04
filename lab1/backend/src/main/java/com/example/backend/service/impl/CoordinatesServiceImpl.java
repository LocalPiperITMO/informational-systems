package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.model.Coordinates;
import com.example.backend.repo.CoordinatesRepository;
import com.example.backend.service.CoordinatesService;

public class CoordinatesServiceImpl implements CoordinatesService {

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Override
    public List<Coordinates> findAllCoordinates() {
        return coordinatesRepository.findAll();
    }
    
}
