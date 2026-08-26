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
import com.dragone.vehicle_rental_api.exception.rental_order.RentalOrderNotFoundException;
import com.dragone.vehicle_rental_api.exception.rental_order.RentalOrderOperationNotAllowedException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleNotFoundException;
import com.dragone.vehicle_rental_api.exception.vehicle.VehicleOperationNotAllowedException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public RentalOrderResponse getRentalOrderById(Integer id){
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        return toResponse(rentalOrder);
    }

    public Page<RentalOrderResponse> getRentalOrders(Pageable pageable){
        return rentalOrderRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public RentalOrderResponse updateRentalOrders(Integer id, RentalOrderRequest rentalOrderRequest){
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        rentalOrder.setStartDate(rentalOrderRequest.startDate());
        rentalOrder.setEndDate(rentalOrderRequest.endDate());
        rentalOrder.setPaymentMethod(rentalOrderRequest.paymentMethod());

        CustomerEntity customer = customerRepository.findByIdAndActiveTrue(rentalOrderRequest.customerId())
                .orElseThrow(() -> new CustomerNotFoundException("customer not found"));

        VehicleEntity vehicle = vehicleRepository.findByIdAndActiveTrue(rentalOrderRequest.vehicleId())
                .orElseThrow(() -> new VehicleNotFoundException("vehicle not found"));

        EmployeeEntity employee = employeeRepository.findByIdAndActiveTrue(rentalOrderRequest.employeeId())
                .orElseThrow(() -> new EmployeeNotFoundException("employee not found"));

        rentalOrder.setCustomer(customer);
        rentalOrder.setVehicle(vehicle);
        rentalOrder.setEmployee(employee);

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);
        return toResponse(rentalOrder);
    }

    public RentalOrderResponse cancelRentalOrder(Integer id){
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        rentalOrder.setStatus(RentalOrderStatus.CANCELLED);

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);
        return toResponse(savedRentalOrder);
    }

    public RentalOrderResponse confirmRentalOrder(Integer id){
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        if (rentalOrder.getStatus() != RentalOrderStatus.PENDING) {
            throw new RentalOrderOperationNotAllowedException("only pending rental orders can be confirmed");
        }

        rentalOrder.setStatus(RentalOrderStatus.CONFIRMED);

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);
        return toResponse(savedRentalOrder);
    }

    public RentalOrderResponse startRental(Integer id) {
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        if (rentalOrder.getStatus() != RentalOrderStatus.CONFIRMED) {
            throw new RentalOrderOperationNotAllowedException("only confirmed rental orders can start rental");
        }

        rentalOrder.setStatus(RentalOrderStatus.ACTIVE);

        VehicleEntity vehicle = rentalOrder.getVehicle();
        vehicle.setStatus(VehicleStatus.RENTED);
        vehicleRepository.save(vehicle);

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);

        return toResponse(savedRentalOrder);
    }

    public RentalOrderResponse finishRental(Integer id) {
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        if (rentalOrder.getStatus() != RentalOrderStatus.ACTIVE) {
            throw new RentalOrderOperationNotAllowedException("only active rental orders can finish rental");
        }

        rentalOrder.setStatus(RentalOrderStatus.COMPLETED);

        VehicleEntity vehicle = rentalOrder.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        RentalOrderEntity savedRentalOrder = rentalOrderRepository.save(rentalOrder);

        return toResponse(savedRentalOrder);
    }

    public RentalOrderResponse payRentalOrder(Integer id){
        RentalOrderEntity rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new RentalOrderNotFoundException("rental order not found"));

        if (rentalOrder.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RentalOrderOperationNotAllowedException("rental order is already paid");
        }

        rentalOrder.setPaymentStatus(PaymentStatus.PAID);

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
