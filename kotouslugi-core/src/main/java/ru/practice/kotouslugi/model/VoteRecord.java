package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "vote_record")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRecord {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "cat_id", nullable = false)
  private Long catId;

  @Column(name = "party_id", nullable = false)
  private Long partyId;

  @Column(name = "vote_date", nullable = false)
  private Date voteDate;

  @Column(name = "election_period", nullable = false, length = 20)
  private String electionPeriod;

  @Column(name = "vote_source", nullable = false, length = 10)
  private String voteSource;

  @Column(name = "voting_point_id")
  private Long votingPointId;

  @Column(name = "encrypted_vote", nullable = false)
  private String encryptedVote;
}
