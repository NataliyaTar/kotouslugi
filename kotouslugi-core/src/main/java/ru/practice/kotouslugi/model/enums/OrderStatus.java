package ru.practice.kotouslugi.model.enums;

public enum OrderStatus {
  ACCEPTED("Принят"),
  ISSUED("Оформлен"),
  IN_PROGRESS("В работе"),
  ASSEMBLED("Собран"),
  ON_THE_WAY("В пути"),
  DELIVERED("Доставлен");
  private String title;
  OrderStatus(String title) {
    this.title = title;
  }
} 