package com.example.backend.dto.response;

import java.util.List;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class DataResponse {
    private List<City> cities;
    private List<Coordinates> coordinates;
    private List<Human> humans;
}
