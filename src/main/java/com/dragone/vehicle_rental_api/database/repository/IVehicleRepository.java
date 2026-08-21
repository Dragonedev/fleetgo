package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVehicleRepository extends JpaRepository<VehicleEntity, Integer> {

    boolean existsByLicensePlate(String licensePlate);
}
