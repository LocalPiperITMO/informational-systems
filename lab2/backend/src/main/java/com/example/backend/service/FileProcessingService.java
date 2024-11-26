package com.example.backend.service;

import java.io.IOException;
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

    private List<CreateQuery> parseToml(MultipartFile file) throws IOException {
        String tomlContent = new String(file.getBytes());

        ObjectMapper tomlMapper = new TomlMapper();
        List<CreateQuery> queries = tomlMapper.readValue(tomlContent, new TypeReference<List<CreateQuery>>() {});

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
        Long x = (Long)data.get("x");
        Double y = (Double)data.get("y");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Coordinates coordinates = new Coordinates(x, y, isModifiable, owner);
        return coordinatesService.createCoordinates(coordinates);
    }

    private City buildCity(Map<String, Object> data, String owner) {
        Coordinates coordinates = fetchCoordinates(data.get("coordinates"), owner);
        Human governor = fetchHuman(data.get("governor"), owner);
        String name = (String)data.get("name");
        Double area = (Double)data.get("area");
        Integer population = (Integer)data.get("population");
        Boolean capital = (Boolean)data.get("capital");
        Integer MASL = (Integer)data.get("metersAboveSeaLevel");
        ZonedDateTime establishmentDate = (ZonedDateTime)data.get("establishmentDate");
        Long telephoneCode = (Long)data.get("telephoneCode");
        Climate climate = (Climate)data.get("climate");
        Government government = (Government)data.get("government");
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
