package ru.practice.kotouslugi.model;

import lombok.Data;

@Data
public class Exhibition {
  private Long id;
  private String name;
  private String date;
  private String city;
  private String system;
  private String organizer;
  private String cost;
  private String deadline;
}
