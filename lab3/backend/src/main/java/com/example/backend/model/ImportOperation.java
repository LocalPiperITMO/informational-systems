package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="import_operations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportOperation {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private OperationStatus status;

    @Column(nullable=false)
    @NotBlank
    private String username;

    @Column(nullable=false)
    @NotBlank
    private String filename;

    @Column(nullable=false)
    @NotBlank
    private String uuid;

    @Column
    @Min(0)
    private Integer objectCount;

}
