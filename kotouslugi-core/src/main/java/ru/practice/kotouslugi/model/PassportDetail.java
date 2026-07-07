package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "passport_detail")
public class PassportDetail {

  @Id
  @GeneratedValue
  private int id;

  @OneToOne
  @JoinColumn(nullable = false)
  private Requisition requisition; // Связь с заявкой (внешний ключ requisition_id)

  @Column(nullable = false, unique = true, length = 20)
  private String passportNumber; // Формат RF-CAT-XXXXXX

  private LocalDate issueDate; // Заполняется, когда статус станет READY

  @Column(nullable = false, length = 50)
  private String country = "РФ";

  @Column(nullable = false, length = 20)
  private String ownerPhone;

  @Column(nullable = false, length = 100)
  private String ownerEmail;

  @Column(nullable = false, length = 256)
  private String photoUrl;

  @Column(columnDefinition = "TEXT")
  private String specialMarks;

  @Column(length = 50)
  private String chipNumber;
}
