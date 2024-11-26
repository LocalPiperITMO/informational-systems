package com.example.backend.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public class PasswordHasher {

    private static byte[] generateSalt() {
        byte[] salt = new byte[16];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        return salt;
    }

    public static HashedPassword hashPassword(String password) {
        byte[] salt = generateSalt();
        byte[] hashedPassword = hashPasswordWithSalt(password, salt);

        return new HashedPassword(hashedPassword, salt);
    }

    public static byte[] retrievePassword(String password, byte[] salt) {
        return hashPasswordWithSalt(password, salt);
    }
    
    private static byte[] hashPasswordWithSalt(String password, byte[] salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            digest.update(salt);
            return digest.digest(password.getBytes());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    @Getter
    @Setter
    @AllArgsConstructor
    public static class HashedPassword {
        private final byte[] hashedPassword;
        private final byte[] salt;
    }
}
