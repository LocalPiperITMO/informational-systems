package com.example.backend.dto.request;

import com.example.backend.model.Coordinates;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
public class CoordinatesRequest {
    private String username;
    private Coordinates coordinates;
}
