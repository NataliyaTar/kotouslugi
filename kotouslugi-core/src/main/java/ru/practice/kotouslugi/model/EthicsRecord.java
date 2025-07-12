package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ethics_records")
@Getter @Setter
public class EthicsRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String catName;
  private LocalDateTime startTime;  // Начало занятия (изменили dateTime на startTime)
  private String courseType;
  private String teacherName;
  private String teacherAbout;
  private String ownerName;
  private String phoneNumber;
  private String email;

  // Длительность занятия в минутах (фиксированная = 60)
  @Transient  // Не сохраняем в БД, вычисляемое поле
  private final int durationMinutes = 60;

  public LocalDateTime getEndTime() {
    return startTime.plusMinutes(durationMinutes);
  }
}
