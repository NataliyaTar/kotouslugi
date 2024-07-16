package ru.practice.kotouslugi.service;

import org.springframework.stereotype.Service;
import ru.practice.kotouslugi.dao.VaccineRepository;
import ru.practice.kotouslugi.dto.VaccineDTO;
import ru.practice.kotouslugi.model.Vaccine;

import java.util.List;

@Service
public class VaccinationService {

    private final VaccineRepository vaccineRepository;

    public VaccinationService(VaccineRepository vaccineRepository) {
    this.vaccineRepository = vaccineRepository;
  }

    public List<Vaccine> getAllVaccines() {
      return (List<Vaccine>) vaccineRepository.findAll();
    }

    public Vaccine addVaccine(VaccineDTO vaccineDTO) {
        Vaccine vaccine = new Vaccine();
        vaccine.setName(vaccineDTO.getName());
        return vaccineRepository.save(vaccine);
    }
}
