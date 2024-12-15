package com.example.backend.exceptions;

public class ServiceNotReadyException extends RuntimeException {
    public ServiceNotReadyException(String message) {
        super(message);
    }
}
