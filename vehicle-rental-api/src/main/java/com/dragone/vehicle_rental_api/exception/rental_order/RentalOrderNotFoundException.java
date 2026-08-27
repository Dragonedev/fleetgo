package com.dragone.vehicle_rental_api.exception.rental_order;

public class RentalOrderNotFoundException extends RuntimeException {
    public RentalOrderNotFoundException(String message) {
        super(message);
    }
}
