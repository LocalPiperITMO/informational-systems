package com.example.backend.service;

import java.io.IOException;
import java.time.ZonedDateTime;
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

    private void buildHuman(Map<String, Object> data, String owner) {
        Integer age = (Integer)data.get("age");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Human human = new Human(age, isModifiable, owner);
        // TODO: agressive refactoring
        // humanService.createHuman(human);
    }

    private void buildCoordinates(Map<String, Object> data, String owner) {
        Long x = (Long)data.get("x");
        Double y = (Double)data.get("y");
        Boolean isModifiable = (Boolean)data.get("isModifiable");
        Coordinates coordinates = new Coordinates(x, y, isModifiable, owner);
        // TODO: agressive refactoring
        // coordinatesService.createCoordinates(coordinates);
    }

    private void buildCity(Map<String, Object> data, String owner) {
        // TODO: try fetching Coordinates
        // TODO: try fetching Human
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
        City city = new City(name, null, area, population, establishmentDate, capital, MASL, telephoneCode, climate, government, null, isModifiable, owner);
        cityService.createCity(city);
    }

    public void processFiles(List<MultipartFile> files, String username) {
        for (MultipartFile file : files) {
            try {
                List<CreateQuery> queries = parseToml(file);
                executeQueries(queries, username);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
