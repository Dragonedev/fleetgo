package com.dragone.vehicle_rental_api.database.model;

import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Column(name = "license_plate", nullable = false)
    private String licensePlate;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotNull
    private Integer year;

    @NotNull
    @PositiveOrZero
    private Integer mileage;

    @NotNull
    @Positive
    private BigDecimal dailyRate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private VehicleStatus status;


}
