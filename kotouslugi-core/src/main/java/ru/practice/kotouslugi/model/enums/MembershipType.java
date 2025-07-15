package ru.practice.kotouslugi.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.net.URLDecoder;

import java.nio.charset.StandardCharsets;

/**
 * Множество для указания типа абонемента (сущность Fitness)
 *
 * @author Роман Бурцев
 * @author Свободные места
 */
public enum MembershipType {
  /**
   * Тип абонемента "Свободный"
   */
  FREE("Свободный"),
  /**
   * Тип абонемента "Групповой"
   */
  GROUP("Групповой"),
  /**
   * Тип абонемента "Персональный"
   */
  PERSONAL("Персональный");

  private String message;

  MembershipType(String message) {
    this.message = message;
  }

  @JsonValue // Указывает, что это значение должно использоваться при сериализации
  public String getMessage() {
    return message;
  }


  public static MembershipType fromMessage(String encodedValue) {
    String decodedValue = URLDecoder.decode(encodedValue, StandardCharsets.UTF_8);

    for (MembershipType type : values()) {
      if (type.message.equals(decodedValue)) {
        return type;
      }
    }
    throw new IllegalArgumentException("Unknown membership type: " + decodedValue);
  }
}
