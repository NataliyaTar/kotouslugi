package ru.practice.kotouslugi.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "vote_record",
  indexes = {
    @Index(name = "idx_vr_cat_period", columnList = "cat_id, election_period", unique = true),
    @Index(name = "idx_vr_party", columnList = "party_id"),
    @Index(name = "idx_vr_period", columnList = "election_period"),
    @Index(name = "idx_vr_period_source", columnList = "election_period, vote_source"),
    @Index(name = "idx_vr_voting_point", columnList = "voting_point_id"),
    @Index(name = "idx_vr_vote_date", columnList = "vote_date")
  }
)
@Data
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

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "party_id", nullable = false,
    foreignKey = @ForeignKey(name = "fk_vote_record_party"))
  private PoliticalParty party;

  @Column(name = "vote_date", nullable = false)
  private Date voteDate;

  @Column(name = "election_period", nullable = false, length = 20)
  private String electionPeriod;

}
