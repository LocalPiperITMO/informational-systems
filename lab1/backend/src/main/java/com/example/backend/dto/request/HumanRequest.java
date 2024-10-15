package com.example.backend.dto.request;

import com.example.backend.model.Human;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class HumanRequest {
    @NotNull
    @NotBlank
    private String token;
    @NotNull
    private Human human;
}
