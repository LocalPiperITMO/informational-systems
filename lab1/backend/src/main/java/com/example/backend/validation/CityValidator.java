package com.example.backend.validation;

import java.time.ZonedDateTime;

import com.example.backend.model.City;
import com.example.backend.model.Climate;
import com.example.backend.model.Coordinates;

public class CityValidator {

    // Non-static methods for individual validations
    private boolean validateId(Long id) {
        return (id != null) && (id > 0);
    }

    private boolean validateName(String name) {
        return (name != null) && (!name.isEmpty());
    }

    private boolean validateCoordinates(Coordinates coordinates) {
        return coordinates != null;
    }

    private boolean validateCreationDate(ZonedDateTime creationDate) {
        return creationDate != null;
    }

    private boolean validateArea(double area) {
        return area > 0;
    }

    private boolean validatePopulation(int population) {
        return population > 0;
    }

    private boolean validateTelephoneCode(long telephoneCode) {
        return (telephoneCode > 0) && (telephoneCode <= 100000);
    }

    private boolean validateClimate(Climate climate) {
        return climate != null;
    }

    public static boolean validateCity(City city) {
        CityValidator validator = new CityValidator();
        
        return validator.validateId(city.getId()) &&
               validator.validateName(city.getName()) &&
               validator.validateCoordinates(city.getCoordinates()) &&
               validator.validateCreationDate(city.getCreationDate()) &&
               validator.validateArea(city.getArea()) &&
               validator.validatePopulation(city.getPopulation()) &&
               validator.validateTelephoneCode(city.getTelephoneCode()) &&
               validator.validateClimate(city.getClimate());
    }
}
