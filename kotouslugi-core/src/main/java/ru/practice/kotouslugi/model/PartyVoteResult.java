package ru.practice.kotouslugi.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartyVoteResult {
  private String partyName;
  private long voteCount;
  private double percentage;
}
