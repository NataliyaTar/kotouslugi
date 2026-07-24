package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Data
@Getter
@Setter
@Entity
@Builder
@Table(name = "cat")
@NoArgsConstructor
@AllArgsConstructor
public class Cat {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
  private String age;
  private String sex;
  private String breed;
}
