package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.CoordinatesRequest;
import com.example.backend.model.Coordinates;

public interface CoordinatesService {
    List<Coordinates> findAllCoordinates();

    List<Coordinates> createCoordinates(CoordinatesRequest coordinatesRequest);
    List<Coordinates> updateCoordinates(CoordinatesRequest coordinatesRequest);
    List<Coordinates> deleteCoordinates(Long coordinatesId);
}
