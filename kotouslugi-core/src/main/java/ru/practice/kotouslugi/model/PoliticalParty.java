package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "political_party",
  indexes = {
    @Index(name = "idx_pp_name", columnList = "name", unique = true),
    @Index(name = "idx_pp_active", columnList = "is_active, id"),
    @Index(name = "idx_pp_candidate", columnList = "candidate_cat_id")
  }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoliticalParty {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false, unique = true, length = 100)
  private String name;

  @Column(name = "description", nullable = false, columnDefinition = "TEXT") // Обязательное по ТЗ
  private String description;

  @Column(name = "logo_url", length = 255, columnDefinition = "TEXT") // Опциональное по ТЗ
  private String logoUrl;

  @Column(name = "candidate_cat_id") // Опциональное по ТЗ
  private Long candidateCatId;

  @Column(name = "created_at", nullable = false) // Обязательное по ТЗ
  private Date createdAt;

  @Column(name = "is_active", nullable = false) // Обязательное по ТЗ
  private boolean isActive;
}
