package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.RequestRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoleRequestsResponse {
    private List<RequestRole> requests;
}
