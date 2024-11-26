package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.HumanRequest;
import com.example.backend.model.Human;
import com.example.backend.repo.HumanRepository;
import com.example.backend.service.HumanService;

@Service
public class HumanServiceImpl implements HumanService{

    @Autowired
    private HumanRepository humanRepository;

    @Override
    public List<Human> findAllHumans() {
        return humanRepository.findAll();
    }

    @Override
    public Human findHumanById(Long humanId) {
        return (humanRepository.findById(humanId).isPresent()) ? humanRepository.findById(humanId).get() : null;
    }

    @Override
    public List<Human> createHuman(HumanRequest request) {
        Human human = request.getHuman();
        humanRepository.save(human);
        return humanRepository.findAll(); // Return all humans after creation
    }

    @Override
    public List<Human> updateHuman(HumanRequest request) {
        Human human = request.getHuman();
        humanRepository.save(human);
        return humanRepository.findAll(); // Return all humans after updating
    }

    @Override
    public List<Human> deleteHuman(Long humanId) {
        humanRepository.deleteById(humanId);
        return humanRepository.findAll(); // Return all humans after deletion
    }
    
}
