package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.ImportOperation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ImportOperationResponse {
    List<ImportOperation> importOperations;
}
