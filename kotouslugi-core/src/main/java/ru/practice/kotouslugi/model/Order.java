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
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String cat_name;
  private String user_name;
  private String store_name;
  @Enumerated(EnumType.STRING)
  private DeliveryType delivery_type;
  private LocalDate delivery_date;
  private LocalDateTime delivery_time;
  private String user_comment;
  @Enumerated(EnumType.STRING)
  private OrderStatus status;
  private LocalDateTime delivery_arrival_time;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "address_id")
  private UserAddress address;
} 