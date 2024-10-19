package com.example.backend.dto.request;

import com.example.backend.model.City;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpecRequest {

    @NotNull
    private String token;

    private Long spec2;
    
    private Long spec4;

    private City spec5;
}
