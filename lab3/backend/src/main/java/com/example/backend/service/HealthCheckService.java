package com.example.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class HealthCheckService {
    private final JdbcTemplate jdbcTemplate;

    public HealthCheckService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean checkPostgresReadiness() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return !(result == null || result != 1);
    }

    public boolean checkMinioReadiness() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity("http://minio-server/minio/health/ready", String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            return false;
        }
    }
}

