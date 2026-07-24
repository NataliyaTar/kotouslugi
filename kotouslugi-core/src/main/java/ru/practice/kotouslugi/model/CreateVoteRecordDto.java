package ru.practice.kotouslugi.model;

import lombok.*;

import java.util.Date;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVoteRecordDto {
  private Long catId;
  private Long partyId;
  private String electionPeriod;
  private String voteSource;
  private String encryptedVote;
  private String passportNumber;
}
