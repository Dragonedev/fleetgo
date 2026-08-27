package com.dragone.vehicle_rental_api.exception.employee;

public class EmployeeOperationNotAllowedException extends RuntimeException {
    public EmployeeOperationNotAllowedException(String message) {
        super(message);
    }
}
