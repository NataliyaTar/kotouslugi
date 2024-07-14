package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "vaccine")
@NoArgsConstructor
@AllArgsConstructor
public class Vaccine {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
}
