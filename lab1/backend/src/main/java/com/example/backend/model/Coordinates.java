package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Coordinates {
    private Long x; //Максимальное значение поля: 443, Поле не может быть null
    private int y; //Максимальное значение поля: 273
    public Coordinates(Long x, int y) {
        this.x = x;
        this.y = y;
    }
}
