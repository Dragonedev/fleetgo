package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.RentalOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRentalOrderRepository extends JpaRepository<RentalOrderEntity, Integer> {
}
