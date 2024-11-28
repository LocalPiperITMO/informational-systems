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
    private List<String> executeQueries(List<CreateQuery> queries, String owner) throws IllegalArgumentException {
        Queue<Pair<String, Object>> queue = new ArrayDeque<>();
        for (CreateQuery query : queries) {
            if (null == query.getType()) {
                throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            } else switch (query.getType()) {
                case "city" -> {
                    queue.add(new Pair<>(query.getType(), entityParsingService.buildCity(query.getData(), owner)));
                }
                case "coordinates" -> {
                    queue.add(new Pair<>(query.getType(), entityParsingService.buildCoordinates(query.getData(), owner)));
                }
                case "human" -> {
                    queue.add(new Pair<>(query.getType(), entityParsingService.buildHuman(query.getData(), owner)));
                }
                default -> throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            }
        }
        List<String> res = queueExecutorService.executeQueue(queue);
        return res;
    }

    public List<String> processFiles(List<MultipartFile> files, String username) {
        List<String> results = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                List<CreateQuery> queries = parseToml(file);
                results.addAll(executeQueries(queries, username));
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