package com.dragone.vehicle_rental_api.dto.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmployeeRequest(

    @NotBlank
    String employeeCode,

    @NotBlank
    String name,

    @NotBlank
    @Email
    String email,

    @NotBlank
    String phone,

    @NotBlank
    String position
) {
}
