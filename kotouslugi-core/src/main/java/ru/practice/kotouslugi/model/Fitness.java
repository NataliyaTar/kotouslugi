package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.MembershipType;

import jakarta.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fitness")
/**
 * Сущность для описания доступных фитнес-клубов
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public class Fitness {
  @Id
  @GeneratedValue
  /**
   * Уникальный идентификатор фитнес-клуба
   */
  private int id;

  /** Название фитнес-клуба */
  private String fitness_club;

  /** Тип абонемента (см. enum MembershipType) */
  private MembershipType membership_type;

  /** Стоимость абонемента в рублях и копейках: XXXX.XX */
  private float price;
}
