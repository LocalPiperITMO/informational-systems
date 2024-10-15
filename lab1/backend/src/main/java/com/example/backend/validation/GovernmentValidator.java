package com.example.backend.validation;

import com.example.backend.model.Government;

public class GovernmentValidator {
    public static Government validateGovernment(String value) {
        if (value == null) return null;
        for (Government g : Government.values()) {
            if (g.name().equals(value)) {
                return g;
            }
        }
        return null;
    }
}
