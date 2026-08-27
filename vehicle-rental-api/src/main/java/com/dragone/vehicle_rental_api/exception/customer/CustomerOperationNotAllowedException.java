package com.dragone.vehicle_rental_api.exception.customer;

public class CustomerOperationNotAllowedException extends RuntimeException {
    public CustomerOperationNotAllowedException(String message) {
        super(message);
    }
}
