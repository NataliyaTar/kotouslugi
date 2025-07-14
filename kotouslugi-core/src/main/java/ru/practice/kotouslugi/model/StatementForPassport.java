package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;



/**
 * Данные, которые приходят из формы "Информация о КотоТуристе".
 * 6 обязательных полей согласно логике frontend.
 **/
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

  @NotNull
  @Column(name = "name", length = 25)
  private String name;

  @NotBlank(message = "Sex is mandatory")
  @Column(name = "sex", length = 10)
  private String sex;

  @NotNull(message = "Date of birth is mandatory")
  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @NotBlank(message = "Place of birth is mandatory")
  @Column(name = "place_born", length = 100)
  private String placeBorn;

  @NotBlank(message = "Registration address is mandatory")
  @Column(name = "reg_adress", length = 100)
  private String regAdress;

  @NotNull(message = "Children is mandatory")
  @Column(name = "children")
  private Boolean children;

  // вроде в беке это поле никак не обрабатывается
  @Column(name = "mvd_place", length = 100)
  private String mvdPlace;

  // вроде в беке это поле никак не обрабатывается
  @Column(name = "time_reception")
  private LocalDateTime timeReception;

  @Column(name = "poshlina")
  private Boolean poshlina = true;
}
