package com.example.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.ImportOperation;

public interface ImportOperationRepository extends JpaRepository<ImportOperation, Long>{
    List<ImportOperation> findByUsername(String username);
}
