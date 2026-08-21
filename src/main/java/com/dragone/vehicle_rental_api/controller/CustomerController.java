package com.dragone.vehicle_rental_api.controller;

import com.dragone.vehicle_rental_api.dto.customer.CustomerRequest;
import com.dragone.vehicle_rental_api.dto.customer.CustomerResponse;
import com.dragone.vehicle_rental_api.service.CustomerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/customers")
@RequiredArgsConstructor
@Validated
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse createCustomer(@Valid @RequestBody CustomerRequest customerRequest){
        return customerService.createCustomer(customerRequest);
    }

    @GetMapping
    public Page<CustomerResponse> getCustomers(Pageable pageable){
        return customerService.getCustomers(pageable);
    }

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable @Positive Integer id){
        return customerService.getCustomerById(id);
    }

    @GetMapping("/document")
    public CustomerResponse getCustomerByDocument(@RequestParam @NotBlank String document){
        return customerService.getCustomerByDocument(document);
    }

    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(@PathVariable @Positive Integer id,
                                           @Valid @RequestBody CustomerRequest customerRequest){
        return customerService.updateCustomer(id, customerRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable @Positive Integer id){
        customerService.deleteCustomer(id);
    }

    @PatchMapping("/{id}/reactive")
    public CustomerResponse reactiveCustomer (@PathVariable @Positive Integer id){
        return customerService.reactiveCustomer(id);
    }
}
