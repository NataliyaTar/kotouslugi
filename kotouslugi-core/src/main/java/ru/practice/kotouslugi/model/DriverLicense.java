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
import ru.practice.kotouslugi.model.enums.DriverLicenseStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "driver_license")
public class DriverLicense {
    @Id
    @GeneratedValue
    private Integer id;
    private String catName;
    private Integer age;
    private String breed;
    private String categories;
    private String drivingSchool;
    private LocalDate examDate;
    private LocalTime examTime;
    private DriverLicenseStatus status;
}
