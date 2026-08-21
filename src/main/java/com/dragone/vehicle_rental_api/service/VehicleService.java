package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import com.dragone.vehicle_rental_api.database.repository.IVehicleRepository;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleRequest;
import com.dragone.vehicle_rental_api.dto.vehicle.VehicleResponse;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleAlreadyExistsException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleNotFoundException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleOperationNotAllowedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<VehicleResponse> getVehicles(Pageable pageable){
        return vehicleRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public VehicleResponse getVehicleById(Integer id){
        VehicleEntity vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("vehicle not found"));

        return toResponse(vehicle);
    }

    public Page<VehicleResponse> getVehiclesByStatus(VehicleStatus status, Pageable pageable){
        return vehicleRepository.findByStatus(status, pageable)
                .map(this::toResponse);
    }

    public VehicleResponse updateVehicle(Integer id, VehicleRequest vehicleRequest){
        VehicleEntity vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("vehicle not found"));

        if(vehicleRepository.existsByLicensePlateAndIdNot(vehicleRequest.licensePlate(), id)){
            throw new VehicleAlreadyExistsException("vehicle already exists");
        }

        vehicle.setLicensePlate(vehicleRequest.licensePlate());
        vehicle.setBrand(vehicleRequest.brand());
        vehicle.setModel(vehicleRequest.model());
        vehicle.setYear(vehicleRequest.year());
        vehicle.setMileage(vehicleRequest.mileage());
        vehicle.setDailyRate(vehicleRequest.dailyRate());
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        VehicleEntity savedVehicle = vehicleRepository.save(vehicle);

        return toResponse(savedVehicle);
    }

    public void deleteVehicle(Integer id){
        VehicleEntity vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("vehicle not found"));

        if(vehicle.getStatus() == VehicleStatus.RENTED
        || vehicle.getStatus() == VehicleStatus.MAINTENANCE){
            throw new VehicleOperationNotAllowedException("vehicle cannot be deleted in its current status");
        }

        vehicle.setStatus(VehicleStatus.UNAVAILABLE);

        vehicleRepository.save(vehicle);
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
