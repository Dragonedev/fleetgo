package com.dragone.vehicle_rental_api.controller;

import com.dragone.vehicle_rental_api.dto.rental_order.RentalOrderRequest;
import com.dragone.vehicle_rental_api.dto.rental_order.RentalOrderResponse;
import com.dragone.vehicle_rental_api.service.RentalOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/rental-orders")
@RequiredArgsConstructor
@Validated
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RentalOrderResponse createRentalOrder(@Valid @RequestBody RentalOrderRequest rentalOrderRequest){
        return rentalOrderService.createRentalOrder(rentalOrderRequest);
    }

    @GetMapping("/{id}")
    public RentalOrderResponse getRentalOrderById(@PathVariable @Positive Integer id) {
        return rentalOrderService.getRentalOrderById(id);
    }

    @GetMapping
    public Page<RentalOrderResponse> getRentalOrders(Pageable pageable) {
        return rentalOrderService.getRentalOrders(pageable);
    }

    @PutMapping("/{id}")
    public RentalOrderResponse updateRentalOrders(@PathVariable @Positive Integer id, @Valid @RequestBody RentalOrderRequest rentalOrderRequest){
        return rentalOrderService.updateRentalOrders(id, rentalOrderRequest);
    }

    @PatchMapping("/{id}/cancel")
    public RentalOrderResponse cancelRentalOrder(@PathVariable @Positive Integer id) {
        return rentalOrderService.cancelRentalOrder(id);
    }

    @PatchMapping("/{id}/confirm")
    public RentalOrderResponse confirmRentalOrder(@PathVariable @Positive Integer id){
        return rentalOrderService.confirmRentalOrder(id);
    }

    @PatchMapping("/{id}/start")
    public RentalOrderResponse startRental(@PathVariable @Positive Integer id) {
        return rentalOrderService.startRental(id);
    }

    @PatchMapping("/{id}/finish")
    public RentalOrderResponse finishRental(@PathVariable @Positive Integer id) {
        return rentalOrderService.finishRental(id);
    }
    
    @PatchMapping("/{id}/pay")
    public RentalOrderResponse payRentalOrder(@PathVariable @Positive Integer id){
        return rentalOrderService.payRentalOrder(id);
    }

}
