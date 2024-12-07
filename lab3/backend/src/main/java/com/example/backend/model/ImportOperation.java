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

    @Column
    @Min(0)
    private Integer objectCount;

    public ImportOperation(OperationStatus oStatus, String username, Integer oc) {
        this.status = oStatus;
        this.username = username;
        this.objectCount = oc;
    }
}
