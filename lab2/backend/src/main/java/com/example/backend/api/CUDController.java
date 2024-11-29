package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.CityRequest;
import com.example.backend.dto.request.CoordinatesRequest;
import com.example.backend.dto.request.DeleteRequest;
import com.example.backend.dto.request.HumanRequest;
import com.example.backend.exceptions.UniqueConstraintViolationException;
import com.example.backend.model.City;
import com.example.backend.model.Climate;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Government;
import com.example.backend.model.Human;
import com.example.backend.service.AdminService;
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

    @Autowired
    private AdminService adminService;

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
            cityService.createCity(city);
            return ResponseEntity.status(201).body(cityService.findAllCities());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        } catch (UniqueConstraintViolationException e) {
            return ResponseEntity.status(409).body(null);
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
            if (!cityService.findCityById(request.getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
            if (!cityService.findCityById(request.getId()).isModifiable()) return ResponseEntity.status(400).body(null);
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
            cityService.updateCity(city, request.getId());
            return ResponseEntity.ok(cityService.findAllCities());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        } catch (UniqueConstraintViolationException e) {
            return ResponseEntity.status(409).body(null);
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
        if (request.getId() == null || cityService.findCityById(request.getId()) == null) return ResponseEntity.status(422).body(null);
        if (!cityService.findCityById(request.getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
        cityService.deleteCity(request.getId());
        return ResponseEntity.ok(cityService.findAllCities());
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
            coordinatesService.createCoordinates(request.getCoordinates());
            return ResponseEntity.status(201).body(coordinatesService.findAllCoordinates());
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
            if (request.getCoordinates().getId() == null || coordinatesService.findCoordinatesById(request.getCoordinates().getId()) == null) return ResponseEntity.status(422).body(null);
            if (!coordinatesService.findCoordinatesById(request.getCoordinates().getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
            if (!coordinatesService.findCoordinatesById(request.getCoordinates().getId()).isModifiable()) return ResponseEntity.status(400).body(null);
            coordinatesService.updateCoordinates(request.getCoordinates(), request.getCoordinates().getId());
            return ResponseEntity.ok(coordinatesService.findAllCoordinates());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteCoordinates")
    public ResponseEntity<List<Coordinates>> deleteCoordinates(
        @Valid
        @RequestBody DeleteRequest request) {
        if (request.getId() == null || coordinatesService.findCoordinatesById(request.getId()) == null) return ResponseEntity.status(422).body(null);
        if (!coordinatesService.findCoordinatesById(request.getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
        cityService.deleteAllCitiesByCoordinates(coordinatesService.findCoordinatesById(request.getId()));
        coordinatesService.deleteCoordinates(request.getId());
        return ResponseEntity.ok(coordinatesService.findAllCoordinates());
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
            humanService.createHuman(request.getHuman());
            return ResponseEntity.status(201).body(humanService.findAllHumans());
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
            if (request.getHuman().getId() == null || humanService.findHumanById(request.getHuman().getId()) == null) return ResponseEntity.status(422).body(null);
            if (!humanService.findHumanById(request.getHuman().getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
            if (!humanService.findHumanById(request.getHuman().getId()).isModifiable()) return ResponseEntity.status(400).body(null);
            humanService.updateHuman(request.getHuman(), request.getHuman().getId());
            return ResponseEntity.ok(humanService.findAllHumans());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @DeleteMapping("/deleteHuman")
    public ResponseEntity<List<Human>> deleteHuman(
        @Valid
        @RequestBody DeleteRequest request) {
        if (request.getId() == null || humanService.findHumanById(request.getId()) == null) return ResponseEntity.status(422).body(null);
        if (!humanService.findHumanById(request.getId()).getOwner().equals(jwtUtil.extractUsername(request.getToken())) && adminService.findByUser(userService.findByUsername(jwtUtil.extractUsername(request.getToken()))) == null) return ResponseEntity.status(400).body(null);
        cityService.deleteAllCitiesByGovernor(humanService.findHumanById(request.getId()));
        humanService.deleteHuman(request.getId());
        return ResponseEntity.ok(humanService.findAllHumans());
    }
}
