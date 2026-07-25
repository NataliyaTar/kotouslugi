package ru.practice.kotouslugi.model;

import lombok.*;

import java.util.Date;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVoteRecordDto {
  private Long catId;
  private String partyName;
  private String electionPeriod;
  private String passportNumber;
}
