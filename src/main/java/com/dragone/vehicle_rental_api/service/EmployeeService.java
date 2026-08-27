package com.dragone.vehicle_rental_api.service;

import com.dragone.vehicle_rental_api.database.model.EmployeeEntity;
import com.dragone.vehicle_rental_api.database.model.VehicleEntity;
import com.dragone.vehicle_rental_api.database.repository.IEmployeeRepository;
import com.dragone.vehicle_rental_api.dto.employee.EmployeeRequest;
import com.dragone.vehicle_rental_api.dto.employee.EmployeeResponse;
import com.dragone.vehicle_rental_api.exception.employee.EmployeeAlreadyExistsException;
import com.dragone.vehicle_rental_api.exception.employee.EmployeeNotFoundException;
import com.dragone.vehicle_rental_api.exception.employee.EmployeeOperationNotAllowedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmployeeService {

    private final IEmployeeRepository employeeRepository;

    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest){
        if(employeeRepository.existsByEmployeeCode(employeeRequest.employeeCode())){
            throw new EmployeeAlreadyExistsException("employee already exists");
        }

        EmployeeEntity employee = EmployeeEntity.builder()
                .employeeCode(employeeRequest.employeeCode())
                .name(employeeRequest.name())
                .email(employeeRequest.email())
                .phone(employeeRequest.phone())
                .position(employeeRequest.position())
                .active(true)
                .build();

        EmployeeEntity savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }

    public Page<EmployeeResponse> getEmployees(Pageable pageable){
        return employeeRepository.findAllByActiveTrue(pageable)
                .map(this::toResponse);
    }

    public EmployeeResponse getEmployeeById(Integer id){
        EmployeeEntity employee = employeeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EmployeeNotFoundException("employee not found"));

        return toResponse(employee);
    }

    public EmployeeResponse getEmployeeByEmployeeCode(String employeeCode){
        EmployeeEntity employee = employeeRepository.findByEmployeeCodeAndActiveTrue(employeeCode)
                .orElseThrow(() -> new EmployeeNotFoundException("employee not found"));

        return toResponse(employee);
    }

    public EmployeeResponse updateEmployee(Integer id, EmployeeRequest employeeRequest){
        EmployeeEntity employee = employeeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(()-> new EmployeeNotFoundException("employee not found"));

        if(employeeRepository.existsByEmployeeCodeAndIdNot(id, employeeRequest.employeeCode())){
            throw new EmployeeAlreadyExistsException("employee already exists");
        }

        employee.setEmployeeCode(employeeRequest.employeeCode());
        employee.setName(employeeRequest.name());
        employee.setEmail(employeeRequest.email());
        employee.setPhone(employeeRequest.phone());
        employee.setPosition(employeeRequest.position());

        EmployeeEntity savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }

    public void deleteEmployee(Integer id){
        EmployeeEntity employee = employeeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(()-> new EmployeeNotFoundException("employee not found"));

        employee.setActive(false);

        employeeRepository.save(employee);
    }


    public EmployeeResponse reactivateEmployee(Integer id){
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(()-> new EmployeeNotFoundException("employee not found"));

        if(employee.getActive()){
            throw new EmployeeOperationNotAllowedException("employee is already active");
        }

        employee.setActive(true);

        EmployeeEntity savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }

    private EmployeeResponse toResponse(EmployeeEntity employee){
        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getPosition(),
                employee.getActive()
        );
    }
}
