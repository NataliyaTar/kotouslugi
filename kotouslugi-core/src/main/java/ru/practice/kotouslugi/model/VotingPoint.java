package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity // Обязательно для JPA-сущностей
@Table(name = "voting_point")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VotingPoint {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, length = 100) // Обязательное поле по ТЗ
  private String name;

  @Column(name = "address", nullable = false, length = 255) // Обязательное поле по ТЗ
  private String address;

  @Column(name = "contact_phone", nullable = false, length = 20) // Исправлен стиль на camelCase
  private String contactPhone;

  @Column(name = "created_at", nullable = false) // Исправлен стиль на camelCase
  private Date createdAt;
}
