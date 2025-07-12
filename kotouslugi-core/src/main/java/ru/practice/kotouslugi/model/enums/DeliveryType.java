package ru.practice.kotouslugi.model.enums;

public enum DeliveryType {
  PICKUP("Самовывоз"),
  DELIVERY("Доставка");

  private String title;

  DeliveryType(String title) {
    this.title = title;
  }
}
