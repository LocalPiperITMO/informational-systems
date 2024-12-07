package com.example.backend.service;

import java.util.List;

import com.example.backend.model.Human;

public interface HumanService {
    List<Human> findAllHumans();
    Human findHumanById(Long humanId);

    Human createHuman(Human human);
    Human updateHuman(Human newHuman, Long humanId);
    void deleteHuman(Long humanId);
}
