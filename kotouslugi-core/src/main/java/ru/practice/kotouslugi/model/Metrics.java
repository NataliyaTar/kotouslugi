package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import ru.practice.kotouslugi.model.enums.StatementStatus;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "metrics")
public class Metrics {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "status")
  private StatementStatus status;

  @Column(name = "date_start")
  private LocalDateTime dateStart;

  @Column(name = "date_end")
  private LocalDateTime dateEnd;
}
