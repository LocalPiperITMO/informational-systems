package com.example.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.RequestRole;
import com.example.backend.model.User;
import com.example.backend.repo.RequestRoleRepository;
import com.example.backend.service.RequestRoleService;

@Service
public class RequestRoleServiceImpl implements RequestRoleService{

    @Autowired
    private RequestRoleRepository requestRoleRepository;

    @Override
    public List<RequestRole> addNewRequest(RequestRole request) {
        requestRoleRepository.save(request);
        return requestRoleRepository.findAll();
    }

    @Override
    public List<RequestRole> deleteRequest(RequestRole request) {
        requestRoleRepository.delete(request);
        return requestRoleRepository.findAll();
    }

    @Override
    public RequestRole findRequest(User user) {
        return requestRoleRepository.findByUser(user);
    }
    
}
