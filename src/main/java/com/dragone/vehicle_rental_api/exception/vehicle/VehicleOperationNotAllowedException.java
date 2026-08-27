package com.dragone.vehicle_rental_api.exception.vehicle;

public class VehicleOperationNotAllowedException extends RuntimeException {
    public VehicleOperationNotAllowedException(String message) {
        super(message);
    }
}
