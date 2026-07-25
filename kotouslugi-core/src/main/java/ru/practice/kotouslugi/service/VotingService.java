package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.dao.PoliticalPartyRepository;
import ru.practice.kotouslugi.dao.VoitingRecordRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.exception.ForbiddenException;
import ru.practice.kotouslugi.model.*;

import java.util.Date;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VotingService {
  private final CatPassportRepository catPassportRepository;
  private final CatRepository catRepository;
  private final VoitingRecordRepository votingRecordRepository;
  private final PoliticalPartyRepository politicalPartyRepository;


  public CreateVoteRecordDto CastAVoteOnline(CreateVoteRecordDto createVoteRecordDto){

    Optional<Cat> cat = catRepository.findById(createVoteRecordDto.getCatId());
    Optional<PassportDetail> passportDetail = catPassportRepository.findByPassportNumber(createVoteRecordDto.getPassportNumber());

    if (!(passportDetail.isPresent() && cat.isPresent())){throw new EntityNotFoundException();}
      Optional<PoliticalParty> politicalParty = politicalPartyRepository.findByName(createVoteRecordDto.getPartyName());
    if (politicalParty.isEmpty()){throw new EntityNotFoundException();}



      VoteRecord voteRecord = VoteRecord.builder()
        .catId(createVoteRecordDto.getCatId())
        .voteDate(new Date())
        .electionPeriod(createVoteRecordDto.getElectionPeriod())
        .party(politicalParty.get())
        .build();

      if (votingRecordRepository.existsByCatId(cat.get().getId())){throw new DuplicateEntityException();}
      votingRecordRepository.save(voteRecord);

      return createVoteRecordDto;
  }
}
