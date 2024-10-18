package com.example.backend.dto.request;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CityRequest {

    @NotBlank(message = "Token is required")
    private String token;

    private Long id;

    @NotNull(message = "Coordinates ID is required")
    private Long coordinatesId;
    
    private Long humanId;

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 255, message = "Name length must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than 0")
    private Double area;

    @NotNull(message = "Population is required")
    @Positive(message = "Population must be greater than 0")
    private Integer population;

    private ZonedDateTime establishmentDate;
    
    private Boolean capital;

    private Integer metersAboveSeaLevel;

    @NotNull(message = "Telephone code is required")
    @Positive(message = "Telephone code must be greater than 0")
    @Max(100000)
    private Long telephoneCode;

    @NotBlank(message = "Climate is required")
    private String climate;

    private String government;

    private Boolean modifiable;
}