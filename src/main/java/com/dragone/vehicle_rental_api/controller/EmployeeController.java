package com.dragone.vehicle_rental_api.controller;

import com.dragone.vehicle_rental_api.dto.employee.EmployeeRequest;
import com.dragone.vehicle_rental_api.dto.employee.EmployeeResponse;
import com.dragone.vehicle_rental_api.service.EmployeeService;
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
@RequestMapping("/v1/employees")
@RequiredArgsConstructor
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse createEmployee(@Valid @RequestBody EmployeeRequest employeeRequest){
        return employeeService.createEmployee(employeeRequest);
    }

    @GetMapping
    public Page<EmployeeResponse> getEmployees(Pageable pageable){
        return employeeService.getEmployees(pageable);
    }

    @GetMapping("/{id}")
    public EmployeeResponse getEmployeeById(@PathVariable @Positive Integer id){
        return employeeService.getEmployeeById(id);
    }

    @GetMapping("/employeeCode")
    public EmployeeResponse getEmployeeByEmployeeCode(@RequestParam @NotBlank String employeeCode){
        return employeeService.getEmployeeByEmployeeCode(employeeCode);
    }

    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(@PathVariable @Positive Integer id,
                                           @Valid @RequestBody EmployeeRequest employeeRequest){
        return employeeService.updateEmployee(id,employeeRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable @Positive Integer id){
        employeeService.deleteEmployee(id);
    }

    @PatchMapping("/{id}/reactivate")
    public EmployeeResponse reactivateEmployee(@PathVariable @Positive Integer id){
        return employeeService.reactivateEmployee(id);
    }
}
