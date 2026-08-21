package com.dragone.vehicle_rental_api.exception;

public class CustomerAlredyExistsException extends RuntimeException {
    public CustomerAlredyExistsException(String message) {
        super(message);
    }
}
