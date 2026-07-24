package ru.practice.kotouslugi.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.PoliticalPartyRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.model.PoliticalParty;
import ru.practice.kotouslugi.model.PoliticalPartyDTO;

import java.util.Date;

@Service
@AllArgsConstructor
public class PoliticalPartyService {
  private final PoliticalPartyRepository politicalPartyRepository;

  public PoliticalParty addPoliticalParty(PoliticalPartyDTO dto){
    PoliticalParty politicalParty = new PoliticalParty().builder()
      .candidateCatId(dto.getCandidateCatId())
      .description(dto.getDescription())
      .logoUrl(dto.getLogoUrl())
      .name(dto.getName())
        .build();

    politicalParty.setCreatedAt(new Date());
    politicalParty.setActive(true);
    return politicalPartyRepository.save(politicalParty);
  }

}
