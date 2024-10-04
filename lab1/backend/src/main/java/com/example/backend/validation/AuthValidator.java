package com.example.backend.validation;

public class AuthValidator {
    
    public static boolean validateUsername(String username) {
        return username != null;
    }

    public static boolean validatePassword(String password) {
        return password != null && password.length() >= 6;
    }
}
