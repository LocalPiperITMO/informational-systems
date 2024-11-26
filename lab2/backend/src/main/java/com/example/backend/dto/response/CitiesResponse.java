package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.City;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CitiesResponse {
    private List<City> cities;
}
