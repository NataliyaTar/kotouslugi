package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "main_entity")
public class MainEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @OneToOne
  @JoinColumn(name = "statement_id", referencedColumnName = "id") //  statement_for_passport
  private StatementForPassport statement;

  @OneToOne
  @JoinColumn(name = "metrics_id", referencedColumnName = "id") // metrics
  private Metrics metrics;

  @OneToOne
  @JoinColumn(name = "feedback_id", referencedColumnName = "id") // feedback
  private Feedback feedback;
}
