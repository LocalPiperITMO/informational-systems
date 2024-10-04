package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.service.CityService;
import com.example.backend.service.CoordinatesService;
import com.example.backend.service.HumanService;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:5173")
public class DataController {

    @Autowired
    private CityService cityService;

    @Autowired
    private CoordinatesService coordinatesService;

    @Autowired
    private HumanService humanService;

    @GetMapping("/cities")
    public ResponseEntity<List<City>> getAllCities() {
        try {
            List<City> cities = cityService.findAllCities();
            if (cities.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching cities", e);
        }
    }

    @GetMapping("/coordinates")
    public ResponseEntity<List<Coordinates>> getAllCoordinates() {
        try {
            List<Coordinates> coordinates = coordinatesService.findAllCoordinates();
            if (coordinates.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(coordinates);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching coordinates", e);
        }
    }

    @GetMapping("/humans")
    public ResponseEntity<List<Human>> getAllHumans() {
        try {
            List<Human> humans = humanService.findAllHumans();
            if (humans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(humans);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching humans", e);
        }
    }
}
