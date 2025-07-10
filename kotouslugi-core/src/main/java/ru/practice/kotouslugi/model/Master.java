package ru.practice.kotouslugi.model;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;

import jakarta.persistence.Table;


@Getter
@Setter
@Entity
@Builder
@Table(name = "MASTER")
@NoArgsConstructor
@AllArgsConstructor
public class Master {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
}
