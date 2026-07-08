package ru.practice.kotouslugi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.practice.kotouslugi.model.enums.AppointmentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {
  @Id
  @GeneratedValue
  private int id;

  private String venueName;
  private String eventName;
  private LocalDateTime visitDatetime;
  private BigDecimal totalCost;

  @Enumerated(EnumType.STRING)
  private AppointmentStatus status;

  private String ownerEmail;
  private String petName;
  private String ownerPhone;
}
