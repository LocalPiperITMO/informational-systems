package com.example.backend.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.SpecRequest;
import com.example.backend.dto.response.SpecResponse;
import com.example.backend.model.City;
import com.example.backend.service.CityService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;
import com.example.backend.utils.SpecOps;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/spec")
@CrossOrigin(origins = "http://localhost:5173")
public class SpecOpsController {
    
    @Autowired
    private CityService cityService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private SpecOps specOps;

    private boolean checkAuth(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return !(userService.findByUsername(username) == null || !jwtUtil.validateToken(token, username));
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException e) {
            return false;
        }
    }


    @PostMapping("/1")
    public ResponseEntity<SpecResponse> spec1(
    @Valid
    @RequestBody SpecRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        List<City> cities = cityService.findAllCities();
        Long result = specOps.telephoneCodeSum(cities);
        SpecResponse response = new SpecResponse();
        response.setSpec1(result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2")
    public ResponseEntity<SpecResponse> spec2(
    @Valid    
    @RequestBody SpecRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        if (request.getSpec2() == null) return ResponseEntity.status(422).body(null);
        List<City> cities = cityService.findAllCities();
        Long result = specOps.countGreaterMASL(cities, request.getSpec2());
        SpecResponse response = new SpecResponse();
        response.setSpec2(result);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/3")
    public ResponseEntity<SpecResponse> spec3(
    @Valid    
    @RequestBody SpecRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        List<City> cities = cityService.findAllCities();
        List<Integer> result = specOps.getDistinctMASL(cities);
        SpecResponse response = new SpecResponse();
        response.setSpec3(result);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/4")
    public ResponseEntity<SpecResponse> spec4(
    @Valid    
    @RequestBody SpecRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        if (request.getSpec4() == null) return ResponseEntity.status(422).body(null);
        List<City> cities = cityService.findAllCities();
        List<City> result = specOps.moveToMinPopulation(cities, request.getSpec4());
        SpecResponse response = new SpecResponse();
        if (result.size() < 2) return ResponseEntity.ok(response);
        cityService.updateCity(result.get(0), result.get(0).getId());
        cityService.updateCity(result.get(1), result.get(1).getId());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/5")
    public ResponseEntity<SpecResponse> spec5(
    @Valid    
    @RequestBody SpecRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(null);
        if (request.getSpec5() == null || !request.getSpec5().isCapital()) return ResponseEntity.status(422).body(null);
        List<City> cities = cityService.findAllCities();
        List<City> result = specOps.moveFromCapital(cities, request.getSpec5());
        SpecResponse response = new SpecResponse();
        for (City city : result) {
            cityService.updateCity(city, city.getId());
        }
        return ResponseEntity.ok(response);
    }
    
}
