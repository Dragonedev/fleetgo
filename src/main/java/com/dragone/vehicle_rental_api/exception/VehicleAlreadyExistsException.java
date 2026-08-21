package com.dragone.vehicle_rental_api.exception;

public class VehicleAlreadyExistsException extends RuntimeException {
    public VehicleAlreadyExistsException(String message) {
        super(message);
    }
}
