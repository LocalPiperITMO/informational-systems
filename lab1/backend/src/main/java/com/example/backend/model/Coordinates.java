package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="coordinates")
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-generated ID for Coordinates

    @Column(nullable = false)
    @NotNull
    @Max(443)
    @Min(-443)
    private Long x;

    @Column(nullable = false)
    @NotNull
    @Max(273)
    @Min(-273)
    private Double y;


    // Constructor with parameters
    public Coordinates(Long x, Double y) {
        this.x = x;
        this.y = y;
    }

}
