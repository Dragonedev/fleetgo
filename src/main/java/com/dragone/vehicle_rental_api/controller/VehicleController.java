package com.dragone.vehicle_rental_api.controller;

import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleRequest;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleResponse;
import com.dragone.vehicle_rental_api.service.VehicleService;
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
@RequestMapping("/v1/vehicles")
@RequiredArgsConstructor
@Validated
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse createVehicle(@Valid @RequestBody VehicleRequest vehicleRequest){
        return vehicleService.createVehicle(vehicleRequest);
    }

    @GetMapping
    public Page<VehicleResponse> getVehicles(Pageable pageable){
        return vehicleService.getVehicles(pageable);
    }

    @GetMapping("/{id}")
    public VehicleResponse getVehicleById(@PathVariable @Positive Integer id){
        return vehicleService.getVehicleById(id);
    }

    @GetMapping("/status")
    public Page<VehicleResponse> getVehiclesByStatus(@RequestParam @NotBlank VehicleStatus status, Pageable pageable){
        return vehicleService.getVehiclesByStatus(status, pageable);
    }

    @PutMapping
    public VehicleResponse updateVehicle(@PathVariable @Positive Integer id,
                                         @RequestBody @Valid VehicleRequest vehicleRequest){
        return vehicleService.updateVehicle(id, vehicleRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicle(@PathVariable @Positive Integer id){
        vehicleService.deleteVehicle(id);
    }


}
