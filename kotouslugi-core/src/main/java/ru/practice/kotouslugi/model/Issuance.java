package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "issuance")
public class Issuance {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "place", length = 255)
  private String place;

  @Column(name = "date")
  private LocalDate issuanceDate;
}
