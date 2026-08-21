package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.CustomerEntity;
import com.dragone.vehicle_rental_api.database.repository.ICustomerRepository;
import com.dragone.vehicle_rental_api.dto.customer.CustomerRequest;
import com.dragone.vehicle_rental_api.dto.customer.CustomerResponse;
import com.dragone.vehicle_rental_api.exception.customer.CustomerAlreadyExistsException;
import com.dragone.vehicle_rental_api.exception.customer.CustomerNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final ICustomerRepository customerRepository;

    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        if (customerRepository.existsByDocument(customerRequest.document())) {
            throw new CustomerAlreadyExistsException("Customer already exists");
        }

        CustomerEntity customer = CustomerEntity.builder()
                .name(customerRequest.name())
                .email(customerRequest.email())
                .phone(customerRequest.phone())
                .document(customerRequest.document())
                .active(true)
                .build();

        CustomerEntity savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);

    }

    public Page<CustomerResponse> getCustomers(Pageable pageable){
        return customerRepository.findByActiveTrue(pageable)
                .map(this::toResponse);
    }

    public CustomerResponse getCustomerById(Integer id) {
        CustomerEntity customer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        return toResponse(customer);
    }

    public CustomerResponse getCustomerByDocument(String document){
        CustomerEntity customer = customerRepository.findByDocumentAndActiveTrue(document)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        return toResponse(customer);
    }

    public CustomerResponse updateCustomer(Integer id, CustomerRequest customerRequest) {
        CustomerEntity customer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        if (customerRepository.existsByDocumentAndIdNot(customerRequest.document(), id)) {
            throw new CustomerAlreadyExistsException("Customer already exists");
        }
        customer.setName(customerRequest.name());
        customer.setEmail(customerRequest.email());
        customer.setPhone(customerRequest.phone());
        customer.setDocument(customerRequest.document());

        CustomerEntity savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);
    }

    public void deleteCustomer(Integer id) {
        CustomerEntity customer = customerRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        customer.setActive(false);

        customerRepository.save(customer);
    }

    private CustomerResponse toResponse(CustomerEntity customer){
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getDocument(),
                customer.getActive()
        );
    }

}
