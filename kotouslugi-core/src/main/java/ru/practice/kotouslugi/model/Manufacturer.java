package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.ManufacturerType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Builder
@Table(name = "manufacturer")
@NoArgsConstructor
@AllArgsConstructor
public class Manufacturer {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String inn;
    private String country;
    private String contactInfo;
    @Enumerated(EnumType.STRING)
    private ManufacturerType type;
    private Double trustRating;
}
