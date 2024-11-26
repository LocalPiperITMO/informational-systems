package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.request.CoordinatesRequest;
import com.example.backend.model.Coordinates;

public interface CoordinatesService {
    List<Coordinates> findAllCoordinates();
    Coordinates findCoordinatesById(Long coordinatesId);

    List<Coordinates> createCoordinates(CoordinatesRequest coordinatesRequest);
    List<Coordinates> updateCoordinates(CoordinatesRequest coordinatesRequest);
    List<Coordinates> deleteCoordinates(Long coordinatesId);
}
