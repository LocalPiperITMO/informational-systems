package com.example.backend.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.City;
import com.example.backend.model.Climate;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Government;
import com.example.backend.model.Human;
import com.example.backend.utils.CreateQuery;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.toml.TomlMapper;

@Service
public class FileProcessingService {
    
    @Autowired
    private HumanService humanService;

    @Autowired
    private CoordinatesService coordinatesService;

    @Autowired
    private CityService cityService;

    @SuppressWarnings("unchecked")
    private List<CreateQuery> parseToml(MultipartFile file) throws IOException {
        String tomlContent = new String(file.getBytes());
        ObjectMapper tomlMapper = new TomlMapper();
        Map<String, Object> root = tomlMapper.readValue(tomlContent, new TypeReference<>() {});
    
        Object queriesData = root.get("createQuery");
        if (queriesData == null) {
            throw new IllegalArgumentException("TOML does not contain any 'createQuery' entries.");
        }
    
        List<Map<String, Object>> queriesList;
        if (queriesData instanceof List<?>) {
            // Multiple objects
            queriesList = (List<Map<String, Object>>) queriesData;
        } else if (queriesData instanceof Map<?, ?>) {
            // Single object
            queriesList = new ArrayList<>();
            queriesList.add((Map<String, Object>) queriesData);
        } else {
            throw new IllegalArgumentException("'createQuery' format is invalid.");
        }
    
        List<CreateQuery> queries = new ArrayList<>();
        for (Map<String, Object> queryData : queriesList) {
            String type = (String) queryData.get("type");
            Map<String, Object> data = (Map<String, Object>) queryData.get("data");
    
            CreateQuery createQuery = CreateQuery.builder()
                    .type(type)
                    .data(data)
                    .build();
            queries.add(createQuery);
        }
    
        return queries;
    }
    
    
       
    

    @Transactional
    private void executeQueries(List<CreateQuery> queries, String owner) throws IllegalArgumentException {
        for (CreateQuery query : queries) {
            if (null == query.getType()) {
                throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            } else switch (query.getType()) {
                case "city" -> {
                    buildCity(query.getData(), owner);
                }
                case "coordinates" -> {
                    buildCoordinates(query.getData(), owner);
                }
                case "human" -> {
                    buildHuman(query.getData(), owner);
                }
                default -> throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            }
        }
    }

    private Human buildHuman(Map<String, Object> data, String owner) {
        Integer age = (Integer)data.get("age");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Human human = new Human(age, isModifiable, owner);
        return humanService.createHuman(human);
    }

    private Coordinates buildCoordinates(Map<String, Object> data, String owner) {
        Long x = (data.get("x") instanceof Integer) 
                ? ((Integer)data.get("x")).longValue()
                : (Long)data.get("x");
        Double y = (data.get("y") instanceof BigDecimal)
                ? ((BigDecimal)data.get("y")).doubleValue()
                : (Double)data.get("y");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Coordinates coordinates = new Coordinates(x, y, isModifiable, owner);
        return coordinatesService.createCoordinates(coordinates);
    }

    private City buildCity(Map<String, Object> data, String owner) {
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
        return cityService.createCity(city);
    }

    private Coordinates fetchCoordinates(Object data, String owner) {
        if (data instanceof Long id) {
            // trying to fetch existing Coordinates object
            Coordinates coordinates = coordinatesService.findCoordinatesById(id);
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

    private Human fetchHuman(Object data, String owner) {
        // governor field is optional
        if (data == null) return null;
        if (data instanceof Long id) {
            // trying to fetch existing Human object
            Human human = humanService.findHumanById(id);
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

    public List<String> processFiles(List<MultipartFile> files, String username) {
        List<String> results = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                List<CreateQuery> queries = parseToml(file);
                executeQueries(queries, username);
                results.add("[SUCCESS] File processed sucessfully.");
            } catch (IOException | IllegalArgumentException e) {
                results.add("[ERROR] Failed to process file: " + e.getMessage());
            } catch (Exception e) {
                results.add("[ERROR] Unexpected error: " + e.getMessage());
            }
        }
        return results;
    }
}
