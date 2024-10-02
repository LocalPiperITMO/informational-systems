package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Human {
    private int age; //Значение поля должно быть больше 0
    public Human(int age) {
        this.age = age;
    }
}