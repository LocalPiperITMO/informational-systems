package com.example.backend.validation;

import com.example.backend.model.Climate;

public class ClimateValidator {
    public static Climate validateClimate(String value) {
        if (value == null) return null;
        for (Climate c : Climate.values()) {
            if (c.name().equals(value)) {
                return c;
            }
        }
        return null;
    }
}
