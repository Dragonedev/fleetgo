package com.dragone.vehicle_rental_api.exception.rental_order;

public class RentalOrderOperationNotAllowedException extends RuntimeException {
    public RentalOrderOperationNotAllowedException(String message) {
        super(message);
    }
}
