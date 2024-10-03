package com.example.backend.model;

import java.time.ZonedDateTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Automatically generate ID
    private int id; // Auto-generated ID should be unique and greater than 0

    @Column(nullable = false)
    private String name; // Must not be null

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "coordinate_x", nullable = false)),
        @AttributeOverride(name = "y", column = @Column(name = "coordinate_y", nullable = false))
    })
    private Coordinates coordinates; // Must not be null

    @Column(nullable = false)
    private ZonedDateTime creationDate; // Automatically generated

    @Column(nullable = false)
    private double area; // Must be greater than 0

    @Column(nullable = false)
    private int population; // Must be greater than 0

    private ZonedDateTime establishmentDate;
    private boolean capital;

    @Column(name = "meters_above_sea_level")
    private Float metersAboveSeaLevel;

    @Column(nullable = false)
    private long telephoneCode; // Must be greater than 0, max: 100000

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Climate climate; // Must not be null

    @Enumerated(EnumType.STRING)
    private Government government; // Can be null

    @Embedded
    private Human governor; // Can be null

    public City() {
        // No-args constructor for JPA
    }

    public City(String name, Coordinates coordinates, double area, int population, Climate climate, Government government, Human governor) {
        this.name = name;
        this.coordinates = coordinates;
        this.creationDate = ZonedDateTime.now();
        this.area = area;
        this.population = population;
        this.climate = climate;
        this.government = government;
        this.governor = governor;
    }
}
