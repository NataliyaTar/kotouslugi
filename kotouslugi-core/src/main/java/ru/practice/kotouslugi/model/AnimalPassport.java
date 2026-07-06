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
@Table(name = "animal_passport")
@NoArgsConstructor
@AllArgsConstructor
public class AnimalPassport {
    @Id
    @GeneratedValue
    private Long id;
    private Long catId;
    private String chipNumber;
    private String kennelName;
    private Boolean verified;
    private Date created;
}
