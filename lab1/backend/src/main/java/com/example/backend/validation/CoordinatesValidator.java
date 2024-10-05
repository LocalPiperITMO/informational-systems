package com.example.backend.validation;

import com.example.backend.model.Coordinates;

public class CoordinatesValidator {

    private boolean validateX(Long x) {
        return (x != null) && (x <= 443);
    }

    private boolean validateY(int y) {
        return y <= 243;
    }

    public static boolean validateCoordinates(Coordinates coordinates) {
        CoordinatesValidator validator = new CoordinatesValidator();
        return validator.validateX(coordinates.getX()) && validator.validateY(coordinates.getY());
    }
}
