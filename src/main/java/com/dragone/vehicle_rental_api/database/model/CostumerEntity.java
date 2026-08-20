package com.dragone.vehicle_rental_api.database.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "costumer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY);
}
