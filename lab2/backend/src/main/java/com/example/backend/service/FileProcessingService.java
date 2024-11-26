package com.example.backend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.utils.CreateQuery;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.toml.TomlMapper;

@Service
public class FileProcessingService {

    private List<CreateQuery> parseToml(MultipartFile file) throws IOException {
        String tomlContent = new String(file.getBytes());

        ObjectMapper tomlMapper = new TomlMapper();
        List<CreateQuery> queries = tomlMapper.readValue(tomlContent, new TypeReference<List<CreateQuery>>() {});

        return queries;
    }

    @Transactional
    private void executeQueries(List<CreateQuery> queries) throws IllegalArgumentException {
        for (CreateQuery query : queries) {
            if (null == query.getType()) {
                throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            } else switch (query.getType()) {
                case "city" -> {
                }
                case "coordinates" -> {
                }
                case "human" -> {
                }
                default -> throw new IllegalArgumentException("Illegal object type! Expected: city, coordinates, human");
            }
        }
    }

    public void processFiles(List<MultipartFile> files) {
        for (MultipartFile file : files) {
            try {
                List<CreateQuery> queries = parseToml(file);
                executeQueries(queries);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
