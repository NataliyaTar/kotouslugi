package ru.practice.kotouslugi.model.FP;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor // Добавляет пустой конструктор
@AllArgsConstructor // Добавляет конструктор со всеми полями
@Entity
@Table(name = "foreign_passports")
public class ForeignPassword implements Serializable {
  ///ForeingPassword - main сущность содержит все данные о заявке.///
  @Id
  @GeneratedValue
  private Long id;

  @Embedded
  private PersonalData personalData;
  @Embedded
  private Metadata metadata;
  @Embedded
  private ProcessingStatus processingStatus;
}
