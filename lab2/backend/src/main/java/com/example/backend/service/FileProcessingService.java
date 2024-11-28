package com.example.backend.service;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.utils.CreateQuery;
import com.example.backend.utils.Pair;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.toml.TomlMapper;

@Service
public class FileProcessingService {

    @Autowired
    private EntityParsingService entityParsingService;

    @Autowired
    private QueueExecutorService queueExecutorService;

    @SuppressWarnings("unchecked")
    private List<CreateQuery> parseToml(MultipartFile file, List<String> logs) throws IOException {
        String tomlContent = new String(file.getBytes());
        logs.add("[INFO] File content read successfully.");
        
        ObjectMapper tomlMapper = new TomlMapper();
        Map<String, Object> root = tomlMapper.readValue(tomlContent, new TypeReference<>() {});
        
        Object queriesData = root.get("createQuery");
        if (queriesData == null) {
            logs.add("[ERROR] TOML file does not contain 'createQuery' entries.");
            throw new IllegalArgumentException("TOML does not contain any 'createQuery' entries.");
        }

        List<Map<String, Object>> queriesList;
        if (queriesData instanceof List<?>) {
            queriesList = (List<Map<String, Object>>) queriesData;
        } else if (queriesData instanceof Map<?, ?>) {
            queriesList = new ArrayList<>();
            queriesList.add((Map<String, Object>) queriesData);
        } else {
            logs.add("[ERROR] 'createQuery' format is invalid.");
            throw new IllegalArgumentException("'createQuery' format is invalid.");
        }

        List<CreateQuery> queries = new ArrayList<>();
        for (Map<String, Object> queryData : queriesList) {
            String type = (String) queryData.get("type");
            Map<String, Object> data = (Map<String, Object>) queryData.get("data");
            CreateQuery createQuery = CreateQuery.builder().type(type).data(data).build();
            logs.add("[INFO] Parsed query of type '" + type + "'.");
            queries.add(createQuery);
        }

        logs.add("[SUCCESS] File parsed successfully.");
        return queries;
    }

    @Transactional
    private List<String> executeQueries(List<CreateQuery> queries, String owner, List<String> logs) throws IllegalArgumentException {
        Queue<Pair<String, Object>> queue = new ArrayDeque<>();
        for (CreateQuery query : queries) {
            try {
                String type = query.getType();
                if (type == null) {
                    throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human.");
                }

                switch (type) {
                    case "city" -> {
                        City city = entityParsingService.buildCity(query.getData(), owner);
                        logs.add("[INFO] Successfully built 'City' object.");
                        queue.add(new Pair<>(type, city));
                    }
                    case "coordinates" -> {
                        Coordinates coordinates = entityParsingService.buildCoordinates(query.getData(), owner);
                        logs.add("[INFO] Successfully built 'Coordinates' object.");
                        queue.add(new Pair<>(type, coordinates));
                    }
                    case "human" -> {
                        Human human = entityParsingService.buildHuman(query.getData(), owner);
                        logs.add("[INFO] Successfully built 'Human' object.");
                        queue.add(new Pair<>(type, human));
                    }
                    default -> throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human.");
                }
            } catch (Exception e) {
                logs.add("[ERROR] Failed to build object " + query.getType() + ". Reason: " + e.getMessage());
                throw e;
            }
        }

        // Execute queue and collect results
        try {
            logs.addAll(queueExecutorService.executeQueue(queue));
        } catch (Exception e) {
            logs.add("[ERROR] Transaction failed: " + e.getMessage());
            throw e;
        }

        return logs;
    }

    public List<String> processFiles(List<MultipartFile> files, String username) {
        List<String> finalLogs = new ArrayList<>();
        for (MultipartFile file : files) {
            List<String> logs = new ArrayList<>();
            try {
                logs.add("[INFO] Processing file: " + file.getOriginalFilename());

                // Parse TOML file
                List<CreateQuery> queries = parseToml(file, logs);

                // Execute queries
                executeQueries(queries, username, logs);

                logs.add("[SUCCESS] File processed successfully.");
            } catch (IOException | IllegalArgumentException e) {
                logs.add("[ERROR] Failed to process file: " + file.getOriginalFilename());
            } catch (Exception e) {
                logs.add("[ERROR] Unexpected error occurred while processing file: " + file.getOriginalFilename());
            } finally {
                finalLogs.addAll(logs);
                finalLogs.add("[END] File processing complete.");
            }
        }
        return finalLogs;
    }
}