package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.RentalOrderEntity;
import com.dragone.vehicle_rental_api.dto.rental_order.RentalOrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRentalOrderRepository extends JpaRepository<RentalOrderEntity, Integer> {

    public Page<RentalOrderEntity> findAll(Pageable pageable);
}
