package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.Human;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class HumansResponse {
    private List<Human> humans;
}
