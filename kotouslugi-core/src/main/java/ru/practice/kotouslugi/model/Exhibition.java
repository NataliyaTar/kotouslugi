package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exhibitions")
public class Exhibition {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String date;
  private String city;
  private String system;
  private String organizer;
  private String cost;
  private String deadline;
}
