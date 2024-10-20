package com.example.backend.service;

import java.util.List;

import com.example.backend.model.RequestRole;
import com.example.backend.model.User;

public interface RequestRoleService {
    List<RequestRole> addNewRequest(RequestRole request);
    List<RequestRole> deleteRequest(RequestRole request);
    RequestRole findRequest(User user);
}
