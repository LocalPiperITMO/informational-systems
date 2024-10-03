package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Coordinates {
    @Column(nullable = false) // Ensure this field cannot be null
    private Long x; // Max value: 443

    @Column(nullable = false) // Ensure this field cannot be null
    private int y; // Max value: 273

    public Coordinates(Long x, int y) {
        this.x = x;
        this.y = y;
    }
}
