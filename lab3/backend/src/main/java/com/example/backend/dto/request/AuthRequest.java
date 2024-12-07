package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthRequest {
    @NotNull
    @NotBlank
    @Size(min = 1, max = 255)
    private String username;

    @NotNull
    @NotBlank
    @Size(min = 6, max = 255)
    private String password;
}
