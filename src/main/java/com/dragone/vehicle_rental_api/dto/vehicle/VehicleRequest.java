package com.dragone.vehicle_rental_api.dto.vehicle;

import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record VehicleRequest(

    @NotBlank
    String brand,

    @NotBlank
    String licensePlate,

    @NotBlank
    String model,

    @NotNull
    Integer year,

    @NotNull
    @PositiveOrZero
    Integer mileage,

    @NotNull
    @Positive
    BigDecimal dailyRate

) {
}
