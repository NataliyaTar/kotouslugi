package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EthicsFeedbacks")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EthicsFeedback {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private int rating;
  private String comment;

  @Column(name = "order_id", unique = true)
  private int orderId;
}
