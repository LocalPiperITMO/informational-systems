package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Human createHuman(Human human) {
        humanRepository.save(human);
        return human;
    }

    @Override
    public Human updateHuman(Human newHuman, Long humanId) {
        Human oldHuman = findHumanById(humanId);
        oldHuman.setAge(newHuman.getAge());
        humanRepository.save(oldHuman);
        return oldHuman;
    }

    @Override
    public void deleteHuman(Long humanId) {
        humanRepository.deleteById(humanId);
    }
    
}
