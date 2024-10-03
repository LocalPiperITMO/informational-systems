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
public class Human {
    @Column(nullable = false) // Ensure this field cannot be null
    private int age; // Must be greater than 0

    public Human(int age) {
        this.age = age;
    }
}
