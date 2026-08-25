package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.CustomerEntity;
import com.dragone.vehicle_rental_api.database.model.EmployeeEntity;
import com.dragone.vehicle_rental_api.database.model.RentalOrderEntity;
import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.database.model.enums.PaymentMethod;
import com.dragone.vehicle_rental_api.database.model.enums.PaymentStatus;
import com.dragone.vehicle_rental_api.database.model.enums.RentalOrderStatus;
import com.dragone.vehicle_rental_api.database.model.enums.VehicleStatus;
import com.dragone.vehicle_rental_api.database.repository.ICustomerRepository;
import com.dragone.vehicle_rental_api.database.repository.IEmployeeRepository;
import com.dragone.vehicle_rental_api.database.repository.IRentalOrderRepository;
import com.dragone.vehicle_rental_api.database.repository.IVehicleRepository;
import com.dragone.vehicle_rental_api.dto.employee.EmployeeResponse;
import com.dragone.vehicle_rental_api.dto.rental_order.RentalOrderRequest;
import com.dragone.vehicle_rental_api.dto.rental_order.RentalOrderResponse;
import com.dragone.vehicle_rental_api.exception.customer.CustomerNotFoundException;
import com.dragone.vehicle_rental_api.exception.employee.EmployeeNotFoundException;
import com.dragone.vehicle_rental_api.exception.rental_order.RentalOrderOperationNotAllowedException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleNotFoundException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleOperationNotAllowedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@RequiredArgsConstructor
@Service
public class RentalOrderService {

    private final IRentalOrderRepository rentalOrderRepository;
    private final ICustomerRepository customerRepository;
    private final IVehicleRepository vehicleRepository;
    private final IEmployeeRepository employeeRepository;


    public RentalOrderResponse createRentalOrder(RentalOrderRequest rentalOrderRequest){
        CustomerEntity customer = customerRepository.findByIdAndActiveTrue(rentalOrderRequest.customerId())
                .orElseThrow(()-> new CustomerNotFoundException("customer not found"));

        VehicleEntity vehicle = vehicleRepository.findByIdAndActiveTrue(rentalOrderRequest.vehicleId())
                .orElseThrow(()-> new VehicleNotFoundException("vehicle not found"));

        if(vehicle.getStatus() != VehicleStatus.AVAILABLE){
            throw new VehicleOperationNotAllowedException("vehicle is not available");
        }

        EmployeeEntity employee = employeeRepository.findByIdAndActiveTrue(rentalOrderRequest.employeeId())
                .orElseThrow(()-> new EmployeeNotFoundException("employee not found"));

        if(!rentalOrderRequest.startDate().isBefore(rentalOrderRequest.endDate())){
            throw new RentalOrderOperationNotAllowedException("Start date must be before end date");
        }

        long days = ChronoUnit.DAYS.between(rentalOrderRequest.startDate(), rentalOrderRequest.endDate());

        BigDecimal totalAmount = vehicle.getDailyRate().multiply(BigDecimal.valueOf(days));

        RentalOrderEntity rentalOrder = RentalOrderEntity.builder()
                .startDate(rentalOrderRequest.startDate())
                .endDate(rentalOrderRequest.endDate())
                .totalAmount(totalAmount)
                .paymentMethod(rentalOrderRequest.paymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .status(RentalOrderStatus.PENDING)
                .customer(customer)
                .vehicle(vehicle)
                .employee(employee)
                .build();

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);

        return toResponse(savedRentalOrder);

    }

    private RentalOrderResponse toResponse(RentalOrderEntity rentalOrder){
        return new RentalOrderResponse(
                rentalOrder.getId(),
                rentalOrder.getStartDate(),
                rentalOrder.getEndDate(),
                rentalOrder.getTotalAmount(),
                rentalOrder.getPaymentMethod(),
                rentalOrder.getPaymentStatus(),
                rentalOrder.getStatus(),
                rentalOrder.getCustomer().getId(),
                rentalOrder.getVehicle().getId(),
                rentalOrder.getEmployee().getId()
        );
    }
}
