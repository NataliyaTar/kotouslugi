package ru.practice.kotouslugi.model.enums;

public enum FeedType {
    DRY_FOOD("Сухой корм"),
    WET_FOOD("Влажный корм"),
    MEDICINAL_FOOD("Лечебный корм");
    private String title;
    FeedType(String title) {
      this.title = title;
    }
} 