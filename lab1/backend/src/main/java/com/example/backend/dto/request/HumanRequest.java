package com.example.backend.dto.request;

import com.example.backend.model.Human;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class HumanRequest {
    private String username;
    private Human human;
}
