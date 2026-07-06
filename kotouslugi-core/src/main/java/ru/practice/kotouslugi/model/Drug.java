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

@Getter
@Setter
@Entity
@Builder
@Table(name = "drug")
@NoArgsConstructor
@AllArgsConstructor
public class Drug {
    @Id
    @GeneratedValue
    private Long id;
    private Long manufacturerId;
    private String tradeName;
    private String innName;
    private String formType;
}
