package ru.practice.kotouslugi.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Date;
@Data
public class PoliticalPartyDTO {
  private String name;
  private String description;
  private String logoUrl;
  private Long candidateCatId;
}
