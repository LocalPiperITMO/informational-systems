package com.example.backend.service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.City;
import com.example.backend.model.Climate;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Government;
import com.example.backend.model.Human;

@Service
public class EntityParsingService {


    @Autowired
    private CoordinatesService coordinatesService;

    @Autowired
    private HumanService humanService;

    public Human buildHuman(Map<String, Object> data, String owner) {
        Integer age = (Integer)data.get("age");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Human human = new Human(age, isModifiable, owner);
        return human;
    }

    public Coordinates buildCoordinates(Map<String, Object> data, String owner) {
        Long x = (data.get("x") instanceof Integer) 
                ? ((Integer)data.get("x")).longValue()
                : (Long)data.get("x");
        Double y = (data.get("y") instanceof BigDecimal)
                ? ((BigDecimal)data.get("y")).doubleValue()
                : (Double)data.get("y");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Coordinates coordinates = new Coordinates(x, y, isModifiable, owner);
        return coordinates;
    }

    public City buildCity(Map<String, Object> data, String owner) {
        Coordinates coordinates = fetchCoordinates(data.get("coordinates"), owner);
        Human governor = fetchHuman(data.get("governor"), owner);
        String name = (String)data.get("name");
        Double area = (data.get("area") instanceof BigDecimal)
                      ? ((BigDecimal)data.get("area")).doubleValue()
                      : (Double)data.get("area");
        Integer population = (data.get("population") instanceof Integer)
                             ? (Integer)data.get("population")
                             : ((Long)data.get("population")).intValue();
        Boolean capital = (Boolean)data.get("capital");
        Integer MASL = (data.get("metersAboveSeaLevel") instanceof Integer)
                       ? (Integer)data.get("metersAboveSeaLevel")
                       : ((Long)data.get("metersAboveSeaLevel")).intValue();
        ZonedDateTime establishmentDate = ZonedDateTime.parse((String)data.get("establishmentDate"));
        Long telephoneCode = (data.get("telephoneCode") instanceof Integer)
                             ? ((Integer)data.get("telephoneCode")).longValue()
                             : (Long)data.get("telephoneCode");
        Climate climate = Climate.valueOf((String)data.get("climate"));
        Government government = Government.valueOf((String)data.get("government"));
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        City city = new City(name, coordinates, area, population, establishmentDate, capital, MASL, telephoneCode, climate, government, governor, isModifiable, owner);
        return city;
    }

    public Coordinates fetchCoordinates(Object data, String owner) {
        if (data instanceof Integer id) {
            // trying to fetch existing Coordinates object
            Coordinates coordinates = coordinatesService.findCoordinatesById(id.longValue());
            if (!coordinates.getOwner().equals(owner)) {
                throw new IllegalArgumentException("Attempt to map City to foreign Coordinates object!");
            }
                return coordinates;
            } else if (data instanceof Map<?, ?> cMap) {
                // constructing new Coordinates object
                @SuppressWarnings("unchecked")
                Map<String, Object> coordinatesMap = (Map<String, Object>) cMap;
                Coordinates coordinates = buildCoordinates(coordinatesMap, owner);
                return coordinates;
            }
            throw new IllegalArgumentException("Invalid constructor for inner Coordinates object!");
        }
    
        public Human fetchHuman(Object data, String owner) {
            // governor field is optional
            if (data == null) return null;
            if (data instanceof Integer id) {
                // trying to fetch existing Human object
                Human human = humanService.findHumanById(id.longValue());
                if (!human.getOwner().equals(owner)) {
                    throw new IllegalArgumentException("Attempt to map City to foreign Human object!");
                }
                return human;
            } else if (data instanceof Map<?, ?> hMap) {
                // constructing new Coordinates object
                @SuppressWarnings("unchecked")
                Map<String, Object> humanMap = (Map<String, Object>) hMap;
                Human human = buildHuman(humanMap, owner);
                return human;
            }
            throw new IllegalArgumentException("Invalid constructor for inner Human object!");
        }

}
