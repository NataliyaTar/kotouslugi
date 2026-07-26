package ru.practice.kotouslugi.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.CatRepository;
import ru.practice.kotouslugi.dao.PoliticalPartyRepository;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.exception.ForbiddenException;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.PoliticalParty;
import ru.practice.kotouslugi.model.PoliticalPartyDTO;

import java.util.Date;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PoliticalPartyService {
  private final PoliticalPartyRepository politicalPartyRepository;
  private final CatRepository catRepository;

  public PoliticalParty addPoliticalParty(PoliticalPartyDTO dto){
    if (politicalPartyRepository.existsByName(dto.getName())){throw new DuplicateEntityException();}
    Optional<Cat> cat = catRepository.findById(dto.getCandidateCatId());
    if (cat.isEmpty()){throw new EntityNotFoundException();}
    if (Integer.parseInt(cat.get().getAge()) < 4){throw new ForbiddenException();}
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
