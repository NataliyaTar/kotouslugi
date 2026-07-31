package ru.practice.kotouslugi.model;

import lombok.Data;

@Data
public class CreatePoliticalPartyDTO {
  private String name;
  private String description;
  private String logoUrl;
  private Long candidateCatId;
  private String passportNumber;
}
