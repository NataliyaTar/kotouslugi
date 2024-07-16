package ru.practice.kotouslugi.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.practice.kotouslugi.dao.VaccineRepository;
import ru.practice.kotouslugi.dto.VaccineDTO;
import ru.practice.kotouslugi.model.Vaccine;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class VaccinationServiceTest {

  private VaccineRepository vaccineRepository;
  private VaccinationService vaccinationService;

  @BeforeEach
  void setUp() {
    vaccineRepository = mock(VaccineRepository.class);
    vaccinationService = new VaccinationService(vaccineRepository);
  }

  @Test
  void shouldReturnVaccineList() {
    when(vaccineRepository.findAll()).thenReturn(getVaccineList());

    vaccinationService.getAllVaccines();

    verify(vaccineRepository).findAll();
  }

  @Test
  void shouldAddVaccine() {
    VaccineDTO vaccineDTO = new VaccineDTO();
    vaccineDTO.setName("Против бешенства");

    Vaccine savedVaccine = new Vaccine();
    savedVaccine.setName("Против бешенства");

    when(vaccineRepository.save(any(Vaccine.class))).thenReturn(savedVaccine);

    Vaccine result = vaccinationService.addVaccine(vaccineDTO);

    verify(vaccineRepository).save(any(Vaccine.class));
    assertEquals("Против бешенства", result.getName());
  }

  private List<Vaccine> getVaccineList() {
    return List.of(
      Vaccine.builder()
        .id(1L)
        .name("Против бешенства")
        .build()
    );
  }
}
