package ru.practice.kotouslugi.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.practice.kotouslugi.model.VoteRecord;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoitingRecordRepository extends CrudRepository<VoteRecord, Long> {

  boolean existsByCatId(Long catId);

  List<VoteRecord> findByElectionPeriod(String period);

  @Query("""
       SELECT v.party.name, COUNT(v)
       FROM VoteRecord v
       WHERE v.electionPeriod = :period
       GROUP BY v.party.name
       """)
  List<Object[]> countVotesByPartyName(@Param("period") String period);
}
