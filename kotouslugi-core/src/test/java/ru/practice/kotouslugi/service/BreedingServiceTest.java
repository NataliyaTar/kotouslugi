package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.BreedingRepository;
import ru.practice.kotouslugi.dao.BreedingRequestRepository;
import ru.practice.kotouslugi.model.Breeding;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class BreedingServiceTest {
  private BreedingRepository breedingRepository;
  private BreedingRequestRepository breedingRequestRepository;
  private BreedingService breedingService;

  @BeforeEach
  void setUp() {
    breedingRepository = mock(BreedingRepository.class);
    breedingRequestRepository = mock(BreedingRequestRepository.class);
    breedingService = new BreedingService(breedingRepository, breedingRequestRepository);
  }

  @Test
  void shouldCreateProfile() {
    Breeding profile = new Breeding();

    Breeding savedProfile = new Breeding();
    savedProfile.setId(1L);
    when(breedingRepository.save(profile)).thenReturn(savedProfile);

    Long id = breedingService.createProfile(profile);

    verify(breedingRepository).save(profile);
    assertNotNull(id);
    assertEquals(1L, id);
  }
}
