package com.dragone.vehicle_rental_api.dto.customer;

public record CustomerResponse(
    Integer id,
    String name,
    String email,
    String phone,
    String document,
    Boolean active
) {
}
