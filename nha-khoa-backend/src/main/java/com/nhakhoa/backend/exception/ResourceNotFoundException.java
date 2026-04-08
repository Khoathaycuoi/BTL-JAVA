// com.nhakhoa.backend.exception.ResourceNotFoundException.java
package com.nhakhoa.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}