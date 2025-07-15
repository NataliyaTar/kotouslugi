package ru.practice.kotouslugi.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;




@Getter
@Setter
@Entity
@Builder
@Table(name = "Type_service")
@NoArgsConstructor
@AllArgsConstructor

public class TypeService
{
  @Id
  @GeneratedValue
  private Long id;
  private String description;
}
