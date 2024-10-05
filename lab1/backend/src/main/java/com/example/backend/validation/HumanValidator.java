package com.example.backend.validation;

import com.example.backend.model.Human;

public class HumanValidator {
    
    private boolean validateAge(int age) {
        return age > 0;
    }

    public static boolean validateHuman(Human human) {
        HumanValidator validator = new HumanValidator();
        
        return validator.validateAge(human.getAge());
    }
}
