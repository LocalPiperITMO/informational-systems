package com.example.backend.dto.request;

import com.example.backend.model.City;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CityRequest {
    private String username;
    private City city;
}
