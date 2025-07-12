package ru.practice.kotouslugi.model.enums;

/**
 * Множество для указания типа абонемента (сущность Fitness)
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public enum MembershipType {
  /**
   * Тип абонемента "Групповой"
   */
  GROUP("Групповой"),
  /**
   * Тип абонемента "Персональный"
   */
  PERSONAL("Персональный"),
  /**
   * Тип абонемента "Свободный"
   */
  FREE("Свободный");

  private String message;

  MembershipType(String message) {
    this.message = message;
  }
}
