package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "metrics_reference")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainStatement {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "statement_for_passport_id", referencedColumnName = "id")
  private StatementForPassport statementForPassport;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "metrics_id", referencedColumnName = "id")
  private Metrics metrics;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "feedback_id", referencedColumnName = "id")
  private Feedback feedback;
}
