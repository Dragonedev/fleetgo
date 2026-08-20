package com.dragone.vehicle_rental_api.dto.employee;

public record EmployeeResponse(
    Integer id,
    String employeeCode,
    String name,
    String email,
    String phone,
    String position
) {
}
