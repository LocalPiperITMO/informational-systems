package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.CityRequest;
import com.example.backend.dto.CoordinatesRequest;
import com.example.backend.dto.HumanRequest;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.service.CUDService;

@RestController
@RequestMapping("/api/logic")
@CrossOrigin(origins = "http://localhost:5173")
public class CUDController {

    @Autowired
    private CUDService cudService;

    // City Endpoints
    @PostMapping("/createCity")
    public ResponseEntity<List<City>> createCity(@RequestBody CityRequest request) {
        try {
            List<City> cities = cudService.createCity(request);
            return ResponseEntity.status(201).body(cities);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateCity")
    public ResponseEntity<List<City>> updateCity(@RequestBody CityRequest request) {
        try {
            List<City> cities = cudService.updateCity(request);
            return ResponseEntity.ok(cities);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCity")
    public ResponseEntity<List<City>> deleteCity(@PathVariable Long id) {
        List<City> cities = cudService.deleteCity(id);
        return ResponseEntity.ok(cities);
    }

    // Coordinates Endpoints
    @PostMapping("/createCoordinates")
    public ResponseEntity<List<Coordinates>> createCoordinates(@RequestBody CoordinatesRequest request) {
        try {
            List<Coordinates> coordinatesList = cudService.createCoordinates(request);
            return ResponseEntity.status(201).body(coordinatesList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateCoordinates")
    public ResponseEntity<List<Coordinates>> updateCoordinates(@RequestBody CoordinatesRequest request) {
        try {
            List<Coordinates> coordinatesList = cudService.updateCoordinates(request);
            return ResponseEntity.ok(coordinatesList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCoordinates")
    public ResponseEntity<List<Coordinates>> deleteCoordinates(@PathVariable Long id) {
        List<Coordinates> coordinatesList = cudService.deleteCoordinates(id);
        return ResponseEntity.ok(coordinatesList);
    }

    // Human Endpoints
    @PostMapping("/createHuman")
    public ResponseEntity<List<Human>> createHuman(@RequestBody HumanRequest request) {
        try {
            List<Human> humans = cudService.createHuman(request);
            return ResponseEntity.status(201).body(humans);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateHuman")
    public ResponseEntity<List<Human>> updateHuman(@RequestBody HumanRequest request) {
        try {
            List<Human> humans = cudService.updateHuman(request);
            return ResponseEntity.ok(humans);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteHuman")
    public ResponseEntity<List<Human>> deleteHuman(@PathVariable Long id) {
        List<Human> humans = cudService.deleteHuman(id);
        return ResponseEntity.ok(humans);
    }
}
