package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grooming_salon")
public class GroomingSalon {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String address;
    private String contactPhone;
    private String availableTimes; // HH:mm comma-separated
    private Boolean providesGroomers;
}
