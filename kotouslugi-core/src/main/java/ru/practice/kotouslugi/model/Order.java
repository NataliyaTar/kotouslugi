package ru.practice.kotouslugi.model;
import ru.practice.kotouslugi.model.enums.DeliveryType;
import ru.practice.kotouslugi.model.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@Table(name = "order")
@NoArgsConstructor
@AllArgsConstructor

public class Order {
  @Id
  @GeneratedValue
  private Long id;
  private String cat_name;
  private String user_name;
  private String store_name;
  private DeliveryType delivery_type;
  private LocalDate delivery_date;
  private LocalDateTime delivery_time;
  private String user_comment;
  private OrderStatus status;
  private LocalDateTime delivery_arrival_time; // дата и время доставки

  @ManyToOne
  @JoinColumn(name = "address_id")
  private UserAddress address;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Review> reviews = new ArrayList<>();
}
