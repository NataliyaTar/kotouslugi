package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@Table(name = "vaccine")
@NoArgsConstructor
@AllArgsConstructor
public class Vaccine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
}
