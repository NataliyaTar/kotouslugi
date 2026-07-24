package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatPassportRepository;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.dao.VoitingRecordRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.model.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
@AllArgsConstructor
public class VoitingService {
  private final CatPassportRepository catPassportRepository;
  private final CatRepository catRepository;
  private final VoitingRecordRepository voitingRecordRepository;



  public CreateVoteRecordDto CastAVoteOnline(CreateVoteRecordDto createVoteRecordDto){
    Optional<Cat> cat = catRepository.findById(createVoteRecordDto.getCatId());
    Optional<PassportDetail> passportDetail = catPassportRepository.findByPassportNumber(createVoteRecordDto.getPassportNumber());
    if (passportDetail.isPresent() && passportDetail.get().isStatus() && cat.isPresent() && Integer.parseInt(cat.get().getAge()) > 3){
      VoteRecord voteRecord = VoteRecord.builder()
        .catId(createVoteRecordDto.getCatId())
        .partyId(createVoteRecordDto.getPartyId())
        .voteDate(new Date())
        .electionPeriod(createVoteRecordDto.getElectionPeriod())
        .encryptedVote(createVoteRecordDto.getEncryptedVote())
        .build();
      if (!voitingRecordRepository.existsByCatId(cat.get().getId())){
        voitingRecordRepository.save(voteRecord);
        return createVoteRecordDto;
      }else {
        throw new DuplicateEntityException();
      }

    }else{
      throw new EntityNotFoundException();
    }
  }
}
