package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "breeding_requests") //заглушка бд
@Data
public class BreedingRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long senderProfileId;   // Кто отправляет запрос
  private Long receiverProfileId; // Кому отправляют запрос
  private String status;
}
