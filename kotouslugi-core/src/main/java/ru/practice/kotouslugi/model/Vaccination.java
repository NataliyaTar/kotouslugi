package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@Table(name = "vaccination")
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {
    @Id
    @GeneratedValue
    private Long id;
    private Long passportId;
    private String vaccineName;
    private String drugBatchCode;
    private Date vaccinationDate;
    private String veterinarian;
    private String clinic;
    private Boolean verified;
}
