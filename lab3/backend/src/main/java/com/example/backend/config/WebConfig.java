package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/file/**") // Applies to all /api/file endpoints
                    .allowedOrigins("http://localhost:5173") // Allow frontend origin
                    .allowedMethods("GET", "POST", "OPTIONS") // Allow these methods
                    .allowedHeaders("*") // Allow all headers, including Authorization
                    .allowCredentials(true); // Allow sending cookies or Authorization headers
            }
        };
    }
}

