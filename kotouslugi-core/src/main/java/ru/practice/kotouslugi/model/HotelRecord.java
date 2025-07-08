package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "hotel_records")
public class HotelRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_care")
  private Long id;

  @Column(name = "id_cat", nullable = false)
  private Long catId;

  @Column(name = "id_hotel", nullable = false)
  private Long hotelId;

  @Column(name = "record_start", nullable = false)
  private LocalDateTime recordStart;

  @Column(name = "record_finish", nullable = false)
  private LocalDateTime recordFinish;

  @Column(name = "record_stat")
  private String recordStatus;
}
