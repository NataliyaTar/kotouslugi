package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import ru.practice.kotouslugi.model.enums.MvdProcessingStatus;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "statement_for_passport")
public class StatementForPassport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "name", length = 25)
  private String name;

  @Column(name = "sex", length = 10)
  private String sex;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Column(name = "place_born", length = 100)
  private String placeBorn;

  @Column(name = "reg_adress", length = 100)
  private String regAdress;

  @Column(name = "children")
  private Boolean children;

  @Column(name = "mvd_place", length = 100)
  private String mvdPlace;

  @Column(name = "time_reception")
  private LocalDateTime timeReception;

  @Enumerated(EnumType.STRING)
  @Column(name = "mvd_processing_status", length = 20)
  private MvdProcessingStatus mvdProcessingStatus = MvdProcessingStatus.NOT_SENT;

  @Column(name = "poshlina")
  private Boolean poshlina = false;

  @Lob
  @Column(name = "photo")
  private byte[] photo;

  @Column(name = "status")
  private Boolean status;

}
