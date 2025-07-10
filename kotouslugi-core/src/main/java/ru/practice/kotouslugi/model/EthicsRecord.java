package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.Getter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ethics_records")
@Getter
public class EthicsRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String catName;          // Имя котика
  private LocalDateTime dateTime;  // Дата и время записи
  private String courseType;       // Тип курса
  private String teacherName;      // Имя учителя
  private String teacherAbout;     // Описание учителя
  private String ownerName;        // Имя хозяина
  private String phoneNumber;      // Номер телефона
  private String email;            // Почта (необязательно)

  public EthicsRecord() {
  }

  public EthicsRecord(String catName, LocalDateTime dateTime, String courseType,
                      String teacherName, String teacherAbout, String ownerName,
                      String phoneNumber, String email) {
    this.catName = catName;
    this.dateTime = dateTime;
    this.courseType = courseType;
    this.teacherName = teacherName;
    this.teacherAbout = teacherAbout;
    this.ownerName = ownerName;
    this.phoneNumber = phoneNumber;
    this.email = email;
  }
}
