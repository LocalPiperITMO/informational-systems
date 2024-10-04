package com.example.backend.dto;

import com.example.backend.model.Human;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class HumanRequest {
    private String username;
    private Human human;
}
