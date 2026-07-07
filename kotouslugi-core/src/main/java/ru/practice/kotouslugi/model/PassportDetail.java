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
  private Long id;

  @OneToOne
  @JoinColumn(nullable = false)
  private Requisition requisition;

  @Column(nullable = false, unique = true, length = 20)
  private String passportNumber;

  private LocalDate issueDate;

  @Column(nullable = false, length = 50)
  private String country = "РФ";

  @Column(nullable = false, length = 20)
  private String ownerPhone;

  @Column(nullable = false, length = 100)
  private String ownerEmail;

  @Column(nullable = false, length = 255)
  private String photoUrl;

  @Column(columnDefinition = "TEXT")
  private String specialMarks;

  @Column(length = 50)
  private String chipNumber;
}
