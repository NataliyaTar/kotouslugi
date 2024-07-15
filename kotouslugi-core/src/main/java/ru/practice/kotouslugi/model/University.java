package ru.practice.kotouslugi.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "university")
public class University {
  @Id
  private Long idUniversity;
  private String universityName;
  private Integer universityScore;
}
