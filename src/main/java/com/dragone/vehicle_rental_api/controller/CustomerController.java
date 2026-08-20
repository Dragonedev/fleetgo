package com.dragone.vehicle_rental_api.controller;

import com.dragone.vehicle_rental_api.dto.customer.CustomerRequest;
import com.dragone.vehicle_rental_api.dto.customer.CustomerResponse;
import com.dragone.vehicle_rental_api.service.CustomerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
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
    public CustomerResponse getCustomerByDocument(@RequestParam @NotBlank String document){
        return customerService.getCustomerByDocument(document);
    }

    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(@PathVariable @Positive Integer id,
                                           @Valid @RequestBody CustomerRequest customerRequest){
        return customerService.updateCustomer(id, customerRequest);
    }
}
