package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.request.HumanRequest;
import com.example.backend.model.Human;

public interface HumanService {
    List<Human> findAllHumans();

    List<Human> createHuman(HumanRequest humanRequest);
    List<Human> updateHuman(HumanRequest humanRequest);
    List<Human> deleteHuman(Long humanId);
}
