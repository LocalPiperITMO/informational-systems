package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.Coordinates;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CoordinatesResponse {
    private List<Coordinates> coordinates;
}
