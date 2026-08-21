package com.dragone.vehicle_rental_api.database.repository;

import com.dragone.vehicle_rental_api.database.model.CustomerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICustomerRepository extends JpaRepository<CustomerEntity, Integer> {

    boolean existsByDocument(String document);

    boolean existsByDocumentAndIdNot(String document, Integer id);

    Page<CustomerEntity> findByActiveTrue(Pageable pageable);

    Optional<CustomerEntity> findByIdAndActiveTrue(Integer id);

    Optional<CustomerEntity> findByDocumentAndActiveTrue(String document);


}
