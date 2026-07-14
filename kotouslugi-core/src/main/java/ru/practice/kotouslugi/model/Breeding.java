package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "breeding_profiles") //пока заглушка
@Data
public class Breeding {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Профиль кошечки
  private String breed;
  private String gender; // MALE - FEMALE
  private String city;
  private Integer age;
  private Boolean hasPedigree;

  private String targetBreed;
  private String targetCity;
  private Integer minAge;
  private Integer maxAge;

  private String status; // ACTIVE, CLOSED
}
