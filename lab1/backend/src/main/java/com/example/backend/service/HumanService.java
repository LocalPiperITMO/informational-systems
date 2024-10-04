package com.example.backend.service;

import java.util.List;

import com.example.backend.model.Human;

public interface HumanService {
    List<Human> findAllHumans();
}
