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

import com.example.backend.dto.request.CityRequest;
import com.example.backend.dto.request.CoordinatesRequest;
import com.example.backend.dto.request.DeleteRequest;
import com.example.backend.dto.request.HumanRequest;
import com.example.backend.model.City;
import com.example.backend.model.Climate;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Government;
import com.example.backend.model.Human;
import com.example.backend.service.CityService;
import com.example.backend.service.CoordinatesService;
import com.example.backend.service.HumanService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;
import com.example.backend.validation.ClimateValidator;
import com.example.backend.validation.GovernmentValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/logic")
@CrossOrigin(origins = "http://localhost:5173")
public class CUDController {

    @Autowired
    private CityService cityService;

    @Autowired
    private CoordinatesService coordinatesService;

    @Autowired
    private HumanService humanService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    private boolean checkAuth(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return !(userService.findByUsername(username) == null || !jwtUtil.validateToken(token, username));
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException e) {
            return false;
        }
    }

    // City Endpoints
    @PostMapping("/createCity")
    public ResponseEntity<List<City>> createCity(
        @Valid 
        @RequestBody CityRequest request) {
        try {
            if (!checkAuth(request.getToken())) {
                return ResponseEntity.status(403).body(null);
            }
            Long coordinatesId = request.getCoordinatesId();
            if (coordinatesId == null) {
                return ResponseEntity.status(422).body(null);
            }
            Coordinates coords = coordinatesService.findCoordinatesById(coordinatesId);
            if (coords == null) {
                return ResponseEntity.status(422).body(null);
            }
            Long humanId = request.getHumanId();
            Human governor = null;
            if (humanId != null) {
                governor = humanService.findHumanById(humanId);
                if (governor == null) {
                    return ResponseEntity.status(422).body(null);
                }
            }
            Climate climate = ClimateValidator.validateClimate(request.getClimate());
            Government government = GovernmentValidator.validateGovernment(request.getGovernment());
            if (climate == null) return ResponseEntity.status(422).body(null);            
            City city = new City(request.getName(), coords, request.getArea(), request.getPopulation(), request.getEstablishmentDate(), request.getCapital(), request.getMetersAboveSeaLevel(), request.getTelephoneCode(), climate, government, governor, request.getModifiable(), jwtUtil.extractUsername(request.getToken()));
            List<City> cities = cityService.createCity(city);
            return ResponseEntity.status(201).body(cities);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateCity")
    public ResponseEntity<List<City>> updateCity(
    @Valid    
    @RequestBody CityRequest request) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            if (request.getId() == null || cityService.findCityById(request.getId()) == null) return ResponseEntity.status(422).body(null);
            Long coordinatesId = request.getCoordinatesId();
            if (coordinatesId == null) {
                return ResponseEntity.status(422).body(null);
            }
            Coordinates coords = coordinatesService.findCoordinatesById(coordinatesId);
            if (coords == null) {
                return ResponseEntity.status(422).body(null);
            }
            Long humanId = request.getHumanId();
            Human governor = null;
            if (humanId != null) {
                governor = humanService.findHumanById(humanId);
                if (governor == null) {
                    return ResponseEntity.status(422).body(null);
                }
            }
            Climate climate = ClimateValidator.validateClimate(request.getClimate());
            Government government = GovernmentValidator.validateGovernment(request.getGovernment());
            if (climate == null) return ResponseEntity.status(422).body(null);            
            City city = new City(request.getName(), coords, request.getArea(), request.getPopulation(), request.getEstablishmentDate(), request.getCapital(), request.getMetersAboveSeaLevel(), request.getTelephoneCode(), climate, government, governor, request.getModifiable(),  jwtUtil.extractUsername(request.getToken()));
            List<City> cities = cityService.updateCity(city, request.getId());
            return ResponseEntity.ok(cities);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCity")
    public ResponseEntity<List<City>> deleteCity(
        @Valid
        @RequestBody DeleteRequest request
    ) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        List<City> cities = cityService.deleteCity(request.getId());
        return ResponseEntity.ok(cities);
    }

    // Coordinates Endpoints
    @PostMapping("/createCoordinates")
    public ResponseEntity<List<Coordinates>> createCoordinates(
    @Valid
    @RequestBody CoordinatesRequest request) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            List<Coordinates> coordinatesList = coordinatesService.createCoordinates(request);
            return ResponseEntity.status(201).body(coordinatesList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateCoordinates")
    public ResponseEntity<List<Coordinates>> updateCoordinates(
    @Valid    
    @RequestBody CoordinatesRequest request) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            List<Coordinates> coordinatesList = coordinatesService.updateCoordinates(request);
            return ResponseEntity.ok(coordinatesList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCoordinates")
    public ResponseEntity<List<Coordinates>> deleteCoordinates(@PathVariable Long id) {
        List<Coordinates> coordinatesList = coordinatesService.deleteCoordinates(id);
        return ResponseEntity.ok(coordinatesList);
    }

    // Human Endpoints
    @PostMapping("/createHuman")
    public ResponseEntity<List<Human>> createHuman(
    @Valid    
    @RequestBody HumanRequest request) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            List<Human> humans = humanService.createHuman(request);
            return ResponseEntity.status(201).body(humans);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/updateHuman")
    public ResponseEntity<List<Human>> updateHuman(
    @Valid    
    @RequestBody HumanRequest request) {
        if (!checkAuth(request.getToken())) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            List<Human> humans = humanService.updateHuman(request);
            return ResponseEntity.ok(humans);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteHuman")
    public ResponseEntity<List<Human>> deleteHuman(@PathVariable Long id) {
        List<Human> humans = humanService.deleteHuman(id);
        return ResponseEntity.ok(humans);
    }
}
