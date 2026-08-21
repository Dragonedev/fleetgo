package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.CustomerEntity;
import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import com.dragone.vehicle_rental_api.database.repository.IVehicleRepository;
import com.dragone.vehicle_rental_api.dto.customer.CustomerResponse;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleRequest;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleResponse;
import com.dragone.vehicle_rental_api.exception.VehicleAlreadyExistsException;
import com.dragone.vehicle_rental_api.exception.VehicleNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final IVehicleRepository vehicleRepository;

    public VehicleResponse createVehicle(VehicleRequest vehicleRequest){
        if(vehicleRepository.existsByLicensePlate(vehicleRequest.licensePlate())){
            throw new VehicleAlreadyExistsException("vehicle already exists");
        }

        VehicleEntity vehicle = VehicleEntity.builder()
                .licensePlate(vehicleRequest.licensePlate())
                .brand(vehicleRequest.brand())
                .model(vehicleRequest.model())
                .year(vehicleRequest.year())
                .mileage(vehicleRequest.mileage())
                .dailyRate(vehicleRequest.dailyRate())
                .status(VehicleStatus.AVAILABLE)
                .build();

        VehicleEntity savedVehicle = vehicleRepository.save(vehicle);

        return toResponse(savedVehicle);
    }

    
    private VehicleResponse toResponse(VehicleEntity vehicle){
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getMileage(),
                vehicle.getDailyRate(),
                vehicle.getStatus()
        );
    }
}
