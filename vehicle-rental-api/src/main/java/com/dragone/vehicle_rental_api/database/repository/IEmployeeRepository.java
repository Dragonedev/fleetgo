package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.EmployeeEntity;
import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.dto.employee.EmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {

    boolean existsByEmployeeCode(String employeeCode);

    Optional<EmployeeEntity> findByEmployeeCodeAndActiveTrue(String employeeCode);

    Optional<EmployeeEntity> findByIdAndActiveTrue(Integer id);

    Page<EmployeeEntity> findAllByActiveTrue(Pageable pageable);

    boolean existsByEmployeeCodeAndIdNot(Integer id, String employeeCode);
}
