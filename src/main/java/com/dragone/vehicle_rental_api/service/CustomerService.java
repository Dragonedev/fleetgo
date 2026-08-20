package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final ICustomerRepository customerRepository;

    public void createCustomer(){

    }
}
