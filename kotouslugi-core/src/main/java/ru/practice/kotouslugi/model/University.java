package ru.practice.kotouslugi.model;

import lombok.*;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "university")
public class University {
  @Id
  private Long idUniversity;
  private String universityName;
  private Integer universityScore;
}
