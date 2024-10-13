package com.example.backend.dto.request;

import com.example.backend.model.City;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CityRequest {
    private String username;
    private City city;
}
