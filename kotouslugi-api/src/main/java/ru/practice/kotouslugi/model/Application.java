package ru.practice.kotouslugi.model;

import lombok.Data;

@Data
public class Application {
  private Long id;
  private Long exhibitionId;
  private String catName;
  private String participationClass;
  private String color;
  private String phone;
  private String email;
}
