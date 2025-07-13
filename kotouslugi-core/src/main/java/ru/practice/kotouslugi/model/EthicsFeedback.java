package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EthicsFeedbacks")
@Data
public class EthicsFeedback {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private int rating;
  private String comment;
  
  @Column(name = "order_id", unique = true)
  private int orderId;
}
