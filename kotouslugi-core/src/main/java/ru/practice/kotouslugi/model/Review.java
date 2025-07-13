package ru.practice.kotouslugi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@Builder
@Table(name = "review")
@NoArgsConstructor
@AllArgsConstructor

public class Review {
  @Id
  @GeneratedValue
  private Long id;
  private Integer rating;
  private String comment;

  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order;
}
