package ru.practice.kotouslugi.model;

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
@Table(name = "address")
@NoArgsConstructor
@AllArgsConstructor
public class UserAddress {
  @Id
  @GeneratedValue
  private Long id;
  private String city;
  private String address;
  private Integer floor;
  private Integer apartment_number;
} 