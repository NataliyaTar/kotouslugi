package ru.practice.kotouslugi.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssuanceRequest {
  private Long id;
  private String place;
  private LocalDateTime issuanceDate;
}
