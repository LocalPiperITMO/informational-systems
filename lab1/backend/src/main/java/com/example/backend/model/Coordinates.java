package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-generated ID for Coordinates

    @Column(nullable = false) // Cannot be null, with a maximum value of 443
    private Long x;

    @Column(nullable = false) // Cannot be null, with a maximum value of 273
    private int y;


    // Constructor with parameters
    public Coordinates(Long x, int y) {
        this.x = x;
        this.y = y;
    }

    // Getters and Setters omitted for brevity
}
