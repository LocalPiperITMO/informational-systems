package com.example.lab1.models;

import java.time.ZonedDateTime;

public class City {
    private int id; //Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически
    private String name; //Поле не может быть null, Строка не может быть пустой
    private Coordinates coordinates; //Поле не может быть null
    private ZonedDateTime creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически
    private double area; //Значение поля должно быть больше 0
    private int population; //Значение поля должно быть больше 0
    private ZonedDateTime establishmentDate;
    private boolean capital;
    private Float metersAboveSeaLevel;
    private long telephoneCode; //Значение поля должно быть больше 0, Максимальное значение поля: 100000
    private Climate climate; //Поле не может быть null
    private Government government; //Поле может быть null
    private Human governor; //Поле может быть null
}
