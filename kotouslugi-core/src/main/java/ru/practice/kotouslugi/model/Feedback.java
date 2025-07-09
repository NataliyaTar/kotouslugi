package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "feedback")
public class Feedback {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "rating")
  private Integer rating;

  @Column(name = "comment", length = 255)
  private String comment;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "statement_id", referencedColumnName = "id")
  private StatementForPassport statementForPassport;
}
