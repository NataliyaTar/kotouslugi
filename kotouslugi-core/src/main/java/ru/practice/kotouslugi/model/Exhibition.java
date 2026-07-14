package ru.practice.kotouslugi.model;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "exhibitions")
@Data
public class Exhibition {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String city;
  private String system;
}
