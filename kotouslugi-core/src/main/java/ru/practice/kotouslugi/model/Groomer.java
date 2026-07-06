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
@Table(name = "groomer")
public class Groomer {
    @Id
    @GeneratedValue
    private Long id;
    private Long salonId;
    private String fullName;
    private String specialization;
    private Double rating;
}
