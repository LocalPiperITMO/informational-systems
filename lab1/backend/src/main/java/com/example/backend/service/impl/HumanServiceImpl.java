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
    
}
