package ru.practice.kotouslugi.model.FP;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor // Добавляет пустой конструктор
@AllArgsConstructor // Добавляет конструктор со всеми полями
@Embeddable
public class Metadata implements Serializable {
  ///Metadata это компонент ForeingPassword, который содержит данные для сбора метрик:
  /// id_ - id самого заявления на загран паспорт
  /// final_status_of_application - финальный статус заявления. Ставится на основе промежуточных статусов МВД и банка.
  /// createdAt
  /// completedAt - ставится после получения final_status_of_application///
  @Builder.Default
  private UUID id_ = UUID.randomUUID();
  private String final_status_of_application;

  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime completedAt;
}
