package ru.practice.kotouslugi.model.FP;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor // Добавляет пустой конструктор
@AllArgsConstructor // Добавляет конструктор со всеми полями
@Embeddable
public class ProcessingStatus implements Serializable {
  ///ProcessingStatus это компонент ForeingPassword, который содержит статусы обработки заявки в МВД и банке.///
  @Builder.Default
  private String mvdProcessingStatus = "не отправлено";
  @Builder.Default
  private Boolean poshlinaPaid = false;
}
