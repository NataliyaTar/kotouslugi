package ru.practice.kotouslugi.model.enums;

public enum AppointmentStatus {
  CONFIRMED("Подтверждена");

  private final String message;

  AppointmentStatus(String message) {
    this.message = message;
  }

  public String getMessage() {
    return message;
  }
}
