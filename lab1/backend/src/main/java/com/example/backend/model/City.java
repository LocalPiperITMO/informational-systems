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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    private Long id;

    @Column(nullable = false)
    @NotNull
    @NotBlank
    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "coordinates_id", referencedColumnName = "id")
    private Coordinates coordinates;

    @Column(nullable = false, updatable = false)
    private ZonedDateTime creationDate;

    @Column(nullable = false)
    @NotNull
    @Positive
    private double area;

    @Column(nullable = false)
    @NotNull
    @Positive
    private int population;

    private ZonedDateTime establishmentDate;

    private boolean capital;

    private Integer metersAboveSeaLevel;

    @Column(nullable = false)
    @NotNull
    @Positive
    @Max(100000)
    private long telephoneCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Climate climate;

    @Enumerated(EnumType.STRING)
    private Government government;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "governor_id", referencedColumnName = "id")
    private Human governor;

    @Column(nullable = false)
    @NotNull
    private boolean modifiable;

    public City(String name, Coordinates coordinates, Double area, Integer population, ZonedDateTime establishmentDate, Boolean capital, Integer metersAboveSeaLevel, Long telephoneCode, Climate climate, Government government, Human governor, Boolean modifiable) {
        this.name = name;
        this.coordinates = coordinates;
        this.creationDate = ZonedDateTime.now();
        this.area = area;
        this.population = population;
        this.establishmentDate = establishmentDate;
        this.capital = capital;
        this.telephoneCode = telephoneCode;
        this.metersAboveSeaLevel = metersAboveSeaLevel;
        this.climate = climate;
        this.government = government;
        this.governor = governor;
        this.modifiable = modifiable;
    }
}
