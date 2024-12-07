package com.example.backend.utils;

import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateQuery {
    private String type;
    private Map<String, Object> data;
}
