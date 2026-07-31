package ru.practice.kotouslugi.service;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.VoitingRecordRepository;
import ru.practice.kotouslugi.model.PartyVoteResult;
import ru.practice.kotouslugi.model.VoteRecord;

import java.beans.Transient;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ResultsVotingService {
  private final VoitingRecordRepository votingRecordRepository;
  @Transactional
  public List<PartyVoteResult> getResults(String period) {
    List<Object[]> raw = votingRecordRepository.countVotesByPartyName(period);
    long total = raw.stream().mapToLong(arr -> (Long) arr[1]).sum();
    if (total == 0) return Collections.emptyList();
    return raw.stream()
      .map(arr -> new PartyVoteResult((String) arr[0], (Long) arr[1], ((Long) arr[1] * 100.0) / total))
      .sorted(Comparator.comparing(PartyVoteResult::getVoteCount).reversed())
      .collect(Collectors.toList());
  }
}
