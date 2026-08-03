package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vet_passport")
public class VetPassport {
  @Id
  @GeneratedValue
  private Integer id;
  private String petName;
  private String breed;
  private Integer age;
  private String gender;
  private String chipNumber;
  private String chipDate;
  private String chipClinic;
  @Column(length = 1000)
  private String notes;
  @Column(length = 2000)
  private String vaccinationsJson; // список вакцинаций как JSON-строка
  private Boolean qrCodeGenerated;
  private Date created;
  private String photoName;
}
