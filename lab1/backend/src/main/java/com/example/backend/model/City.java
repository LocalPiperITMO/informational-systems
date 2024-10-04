package com.example.backend.model;

import java.time.ZonedDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="cities")
public class City {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Auto-generated ID (must be unique and greater than 0)

    @Column(nullable = false)
    private String name; // Cannot be null, cannot be empty

    @OneToOne(cascade = CascadeType.ALL) // Assume one coordinate for each city
    @JoinColumn(name = "coordinates_id", referencedColumnName = "id")
    private Coordinates coordinates; // Cannot be null

    @Column(nullable = false, updatable = false)
    private ZonedDateTime creationDate; // Cannot be null, automatically generated

    @Column(nullable = false)
    private double area; // Must be greater than 0

    @Column(nullable = false)
    private int population; // Must be greater than 0

    private ZonedDateTime establishmentDate;

    private boolean capital;

    private Float metersAboveSeaLevel;

    @Column(nullable = false)
    private long telephoneCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Climate climate;

    @Enumerated(EnumType.STRING)
    private Government government;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "governor_id", referencedColumnName = "id")
    private Human governor;


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

    // Getters and Setters omitted for brevity
}
