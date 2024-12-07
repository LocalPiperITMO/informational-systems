package com.example.backend.dto.request;

import com.example.backend.model.Coordinates;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
public class CoordinatesRequest {

    @NotNull
    @NotBlank
    private String token;

    @NotNull
    private Coordinates coordinates;
}
