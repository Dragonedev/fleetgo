package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {
}
