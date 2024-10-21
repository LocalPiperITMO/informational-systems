package com.example.backend.utils;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Verdict {
    @NotNull
    @NotBlank
    private String username;
    
    @NotNull
    @NotBlank
    private String status;
}
