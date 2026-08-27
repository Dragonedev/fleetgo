package com.dragone.vehicle_rental_api.exception.vehicle;

public class VehicleNotFoundException extends RuntimeException {
    public VehicleNotFoundException(String message) {
        super(message);
    }
}
