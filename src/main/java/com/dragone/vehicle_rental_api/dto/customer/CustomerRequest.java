package com.dragone.vehicle_rental_api.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CustomerRequest(

    @NotBlank
    String name,

    @NotBlank
    @Email
    String email,

    @NotBlank
    String phone,

    @NotBlank
    String document
){
}
