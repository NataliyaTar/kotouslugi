package ru.practice.kotouslugi.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Table(name = "political_party")
public class PoliticalParty {
  @Id
  @GeneratedValue
  private Long id;
}
