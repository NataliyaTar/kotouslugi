package ru.practice.kotouslugi.model.enums;

import lombok.Getter;

public enum Teachers {
TEACHER1
  (1,"Могутнов Ярослав Романович","мужской","Должность: младший преподаватель, " +
    "возраст: 21 год,стаж работы 2 года")
  ,TEACHER2(2,"Петрунин Антон Дмитриевич","мужской","Должность:  преподаватель, \" +\n" +
    "    \"возраст: 20 лет,стаж работы: 4 года\""),
  TEACHER3(3,"Лифатов Даниил Евгеньевич","мужской","Должность: старший преподаватель, \" +\n" +
    "    \"возраст: 22 года,стаж работы 6 года\""),
  TEACHER4(1,"Иванова Алена Сергеевна","женский","Должность: мега старший преподаватель, возраст 25, стаж работы 10 лет");

@Getter
private final int id;
@Getter
private final String name;
@Getter
private final String sex;
@Getter
private final String description;

  Teachers(int id, String name,String sex,String description) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.sex = sex;
}

}
