package ru.practice.kotouslugi.model.enums;

public enum Taste {
  TUNA_TASTE("Вкус тунца"),
  TURKEY_TASTE("Вкус индейки"),
  BEEF_FLAVOR("Вкус говядины"),
  HAM_FLAVOR("Вкус ветчины"),
  CHICKEN_TASTE("Вкус курицы");

  private String title;

  Taste(String title) {
    this.title = title;
  }
}
