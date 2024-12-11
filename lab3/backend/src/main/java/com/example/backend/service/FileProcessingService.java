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

import com.example.backend.dto.response.FileResponse;
import com.example.backend.model.City;
import com.example.backend.model.Coordinates;
import com.example.backend.model.Human;
import com.example.backend.model.ImportOperation;
import com.example.backend.model.OperationStatus;
import com.example.backend.repo.ImportOperationRepository;
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
    private TransactionManagerService TMS;

    @Autowired
    private ImportOperationRepository importOperationRepository;

    @SuppressWarnings("unchecked")
    private List<CreateQuery> parseToml(MultipartFile file, List<String> logs) throws IOException {
        String tomlContent = new String(file.getBytes());
        logs.add("[INFO] File content read successfully.");
        
        ObjectMapper tomlMapper = new TomlMapper();
        try {
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
        } catch (IOException e) {
            logs.add("[ERROR] Invalid TOML structure: " + e.getMessage());
            throw new IllegalArgumentException("Unknown token at line or invalid TOML structure.", e);
        }
    }
    

    @Transactional
    private List<String> executeQueries(List<CreateQuery> queries, String owner, MultipartFile file, List<String> logs) throws IllegalArgumentException {
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
            logs.addAll(TMS.execute(queue, file));
        } catch (Exception e) {
            logs.add("[ERROR] Transaction failed: " + e.getMessage());
            throw e;
        }

        return logs;
    }

    public FileResponse processFiles(List<MultipartFile> files, String username) {
        List<String> finalLogs = new ArrayList<>();
        int faultyCount = 0;
        for (MultipartFile file : files) {
            List<String> logs = new ArrayList<>();
            boolean isSuccess = true;
            int objCount = 0;
            try {
                logs.add("[INFO] Processing file: " + file.getOriginalFilename());
                
                List<CreateQuery> queries = parseToml(file, logs);
                objCount = queries.size();
                executeQueries(queries, username, file, logs);
                
            } catch (IllegalArgumentException e) {
                isSuccess = false;
                if (e.getMessage().contains("Unknown token at line")) {
                    logs.add("[ERROR] File " + file.getOriginalFilename() + " has an illegal structure: " + e.getMessage());
                } else {
                    logs.add("[ERROR] File " + file.getOriginalFilename() + " encountered an error: " + e.getMessage());
                }
            } catch (Exception e) {
                isSuccess = false;
                logs.add("[ERROR] File " + file.getOriginalFilename() + " encountered an unexpected error: " + e.getMessage());
            } finally {
                if (logs.stream().anyMatch(log -> log.startsWith("[ERROR]"))) {
                    isSuccess = false;
                }
    
                if (!isSuccess) {
                    faultyCount += 1;
                    logs.add("[ERROR] File " + file.getOriginalFilename() + " encountered an error.");
                } else {
                    logs.add("[SUCCESS] File " + file.getOriginalFilename() + " processed successfully.");
                }
                importOperationRepository.save(new ImportOperation((isSuccess)? OperationStatus.SUCCESS : OperationStatus.ERROR, username, (isSuccess)? objCount : 0));
                finalLogs.addAll(logs);
                finalLogs.add("[END] Processing for file " + file.getOriginalFilename() + " completed.");
            }
        }
        return new FileResponse(faultyCount,finalLogs);
    }    
    
}