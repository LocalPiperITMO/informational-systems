package com.example.backend.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

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

        return new HashedPassword(Base64.getEncoder().encodeToString(hashedPassword),
                                  Base64.getEncoder().encodeToString(salt));
    }

    public static String retrievePassword(String password, byte[] salt) {
        byte[] hashedPassword = hashPasswordWithSalt(password, salt);
        return Base64.getEncoder().encodeToString(hashedPassword);
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

    public static class HashedPassword {
        private final String hashedPassword;
        private final String salt;

        public HashedPassword(String hashedPassword, String salt) {
            this.hashedPassword = hashedPassword;
            this.salt = salt;
        }

        public String getHashedPassword() {
            return hashedPassword;
        }

        public String getSalt() {
            return salt;
        }
    }
}
