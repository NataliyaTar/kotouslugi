package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.UniversityRepository;
import ru.practice.kotouslugi.model.University;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class UniversityServiceTest {
  private UniversityRepository universityRepository;
  private UniversityService universityService;

  @BeforeEach
  public void setUp() {
    universityRepository = mock(UniversityRepository.class);
    universityService = new UniversityService(universityRepository);
  }

  @Test
  void shouldReturnUniversityListByExamAmount() {
    when(universityRepository.findByUniversityScoreLessThanEqual(400)).thenReturn(
      getUniversityListByScore()
    );

    universityService.findUniversitiesByScore(400);

    verify(universityRepository).findByUniversityScoreLessThanEqual(400);
  }

  private List<University> getUniversityListByScore() {
    return List.of(
      University.builder()
        .idUniversity(1L)
        .universityName("МГУ имени М.В. Ломоносова")
        .universityScore(400)
        .build()
    );
  }
}
