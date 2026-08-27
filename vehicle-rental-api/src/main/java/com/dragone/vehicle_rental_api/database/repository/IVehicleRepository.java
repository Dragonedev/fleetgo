package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IVehicleRepository extends JpaRepository<VehicleEntity, Integer> {

    boolean existsByLicensePlate(String licensePlate);

    boolean existsByLicensePlateAndIdNot(String licensePlate, Integer id);

    Page<VehicleEntity> findAllByActiveTrue(Pageable pageable);

    Optional<VehicleEntity> findByIdAndActiveTrue(Integer id);

    Page<VehicleEntity> findByStatusAndActiveTrue(VehicleStatus status, Pageable pageable);

}
