package com.example.backend.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileRequest {
    @NotNull
    @NotBlank
    private String token;
    
    @NotNull
    private List<MultipartFile> files;
}
