package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.CustomerEntity;
import com.dragone.vehicle_rental_api.database.repository.ICustomerRepository;
import com.dragone.vehicle_rental_api.dto.customer.CustomerRequest;
import com.dragone.vehicle_rental_api.dto.customer.CustomerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final ICustomerRepository customerRepository;

    public CustomerResponse createCustomer(CustomerRequest customerRequest){
        if (customerRepository.existsByDocument(customerRequest.document())) {
            throw new RuntimeException("Customer already exists");
        }

        CustomerEntity customer = CustomerEntity.builder()
                .name(customerRequest.name())
                .email(customerRequest.email())
                .phone(customerRequest.phone())
                .document(customerRequest.document())
                .build();

        CustomerEntity savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);

    }

    public CustomerResponse getCustomerByDocument(String document){
        CustomerEntity customer = customerRepository.findByDocument(document)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toResponse(customer);
    }

    public CustomerResponse getCustomerById(Integer id){
        CustomerEntity customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return toResponse(customer);
    }

    public CustomerResponse updateCustomer(Integer id, CustomerRequest customerRequest){
        CustomerEntity customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(customerRequest.name());
        customer.setEmail(customerRequest.email());
        customer.setPhone(customerRequest.phone());
        customer.setDocument(customerRequest.document());

        CustomerEntity savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);
    }
    private CustomerResponse toResponse(CustomerEntity customer){
        return new CustomerResponse(
                customer.getId(),
                customer.getDocument(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone()
        );
    }

}
