package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.BreedingRepository;
import ru.practice.kotouslugi.dao.BreedingRequestRepository;
import ru.practice.kotouslugi.model.Breeding;
import ru.practice.kotouslugi.model.BreedingRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class BreedingService {

  private final BreedingRepository breedingRepository;
  private final BreedingRequestRepository breedingRequestRepository;

  public BreedingService(BreedingRepository breedingRepository, BreedingRequestRepository breedingRequestRepository) {
    this.breedingRepository = breedingRepository;
    this.breedingRequestRepository = breedingRequestRepository;
  }

  public Long createProfile(Breeding breeding) {
    breeding.setStatus("ACTIVE");
    Breeding saved = breedingRepository.save(breeding);
    return saved.getId();
  }

  public List<Breeding> findMatches(Long profileId) {
    Breeding myCat = breedingRepository.findById(profileId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Анкета не найдена"));
    
    return breedingRepository.findByBreedAndCityAndGenderNot(
      myCat.getBreed(),
      myCat.getCity(),
      myCat.getGender()
    );
  }

  public Long sendRequest(BreedingRequest request) {
    request.setStatus("PENDING");
    BreedingRequest saved = breedingRequestRepository.save(request);
    return saved.getId();
  }

  public void updateRequestStatus(Long requestId, String status) {
    BreedingRequest request = breedingRequestRepository.findById(requestId)
      .orElseThrow(() -> new RuntimeException("Запрос не найден"));
    request.setStatus(status);
    breedingRequestRepository.save(request);
  }
  public void deleteProfile(Long profileId) {
    Breeding breeding = breedingRepository.findById(profileId)
      .orElseThrow(() -> new RuntimeException("Анкета не найдена"));

    breedingRepository.delete(breeding);
  }
}

