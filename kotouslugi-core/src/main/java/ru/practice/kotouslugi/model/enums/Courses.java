package ru.practice.kotouslugi.model.enums;

import lombok.Getter;

public enum Courses {
  COURSE1(1,"Приучение к лотку"),
  COURSE2(2,"Основые этикета"),
  COURSE3(3,"Социализация");
@Getter
  private final int id;
@Getter
  private final String name;

   Courses(int id, String name) {
    this.id = id;
    this.name = name;
  }
}
