package com.example.backend.service;

import java.util.List;

import com.example.backend.model.Coordinates;

public interface CoordinatesService {
    List<Coordinates> findAllCoordinates();
    Coordinates findCoordinatesById(Long coordinatesId);

    Coordinates createCoordinates(Coordinates coordinates);
    Coordinates updateCoordinates(Coordinates newCoordinates, Long id);
    void deleteCoordinates(Long coordinatesId);
}
