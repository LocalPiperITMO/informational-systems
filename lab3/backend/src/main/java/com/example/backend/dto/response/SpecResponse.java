package com.example.backend.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpecResponse {
    private Long spec1;
    private Long spec2;
    private List<Integer> spec3;
}
