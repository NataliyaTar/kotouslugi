package ru.practice.kotouslugi.model.enums;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

@Getter
@Setter
@Entity
@Builder
@Table(name = "shop")
@NoArgsConstructor
@AllArgsConstructor

public class Shop {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
}
