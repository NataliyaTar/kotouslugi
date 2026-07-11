package ru.practice.kotouslugi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@Data
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "passport_detail")
public class PassportDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(nullable = false)
  private Requisition requisition;

  @Column(name = "passportNumber", nullable = false, unique = true, length = 20)
  private String passportNumber;

  @Column(name = "issueDate")
  private LocalDate issueDate;


  @Column(name = "country", nullable = false, length = 50)
  private String country = "РФ";

  @Column(name = "ownerPhone", nullable = false, length = 20)
  private String ownerPhone;

  @Column(name = "ownerEmail", nullable = false, length = 100)
  private String ownerEmail;

  @Column(name = "photoUrl", nullable = false, length = 255)
  private String photoUrl;

  @Column(name = "specialMarks", columnDefinition = "TEXT")
  private String specialMarks;

  @Column(name = "chipNumber", length = 50)
  private String chipNumber;
}
