package ru.practice.kotouslugi.model;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
@Builder
@Data
public class PassportDTO {
  private Long id;
  private Integer requisition;
  private String passportNumber;
  private LocalDate issueDate;
  @Builder.Default
  private String country = "РФ";
  private String ownerPhone;
  private String ownerEmail;
  private String photoUrl;
  private String specialMarks;
  private String chipNumber;
  private boolean status;
}
