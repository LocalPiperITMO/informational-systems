package com.example.backend.service;

import java.util.List;

import com.example.backend.model.Coordinates;

public interface CoordinatesService {
    List<Coordinates> findAllCoordinates();
}
