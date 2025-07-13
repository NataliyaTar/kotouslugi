package ru.practice.kotouslugi.model;
import ru.practice.kotouslugi.model.enums.FeedType;
import ru.practice.kotouslugi.model.enums.Taste;

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
@Table(name = "product")
@NoArgsConstructor
@AllArgsConstructor
public class Product {
  @Id
  @GeneratedValue
  private Long id;
  private String food_name;
  private FeedType feed_type;
  private Taste taste;
  private Integer weight_grams;
  private Double price;

}
