package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "service_type", nullable = false, length = 20)
  private String serviceType;

  @Column(name = "related_id", nullable = false)
  private Long relatedId;

  @Column(name = "rating", nullable = false)
  private int rating;

  @Column(name = "comment", columnDefinition = "TEXT")
  private String comment;

  @Column(name = "created_at", nullable = false)
  private Date createdAt;
}
