package com.dragone.vehicle_rental_api.dto.rental_order;

import com.dragone.vehicle_rental_api.database.model.enums.PaymentMethod;
import com.dragone.vehicle_rental_api.database.model.enums.PaymentStatus;
import com.dragone.vehicle_rental_api.database.model.enums.RentalOrderStatus;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RentalOrderRequest(

    @NotNull
    LocalDate startDate,

    @NotNull
    LocalDate endDate,

    @NotNull
    PaymentMethod paymentMethod

) {
}
