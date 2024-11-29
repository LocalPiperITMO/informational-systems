package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.response.CitiesResponse;
import com.example.backend.dto.response.CoordinatesResponse;
import com.example.backend.dto.response.HumansResponse;
import com.example.backend.dto.response.ImportOperationResponse;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.model.ImportOperation;
import com.example.backend.repo.ImportOperationRepository;
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

    @Autowired
    private ImportOperationRepository ImportOperationRepository;
    
    @PostMapping("/cities")
    public ResponseEntity<CitiesResponse> getAllCities(@RequestBody String entity) {
        try {
            List<City> cities = cityService.findAllCities();
            return ResponseEntity.ok(new CitiesResponse(cities));
        } catch (Exception e) {
            throw new ResponseStatusException(500, "Error fetching cities", e);
        }
    }

    @PostMapping("/coordinates")
    public ResponseEntity<CoordinatesResponse> getAllCoordinates(@RequestBody String entity) {
        try {
            List<Coordinates> coordinates = coordinatesService.findAllCoordinates();
            return ResponseEntity.ok(new CoordinatesResponse(coordinates));
        } catch (Exception e) {
            throw new ResponseStatusException(500, "Error fetching coordinates", e);
        }
    }

    @PostMapping("/humans")
    public ResponseEntity<HumansResponse> getAllHumans(@RequestBody String entity) {
        try {
            List<Human> humans = humanService.findAllHumans();
            return ResponseEntity.ok(new HumansResponse(humans));
        } catch (Exception e) {
            throw new ResponseStatusException(500, "Error fetching humans", e);
        }
    }

    @PostMapping("/imops")
    public ResponseEntity<ImportOperationResponse> getAllImops(@RequestBody String entity) {
        try {
            List<ImportOperation> imops = ImportOperationRepository.findAll();
            return ResponseEntity.ok(new ImportOperationResponse(imops));
        } catch (Exception e) {
            throw new ResponseStatusException(500, "Error fetching imops", e);
        }

    }
    
}
