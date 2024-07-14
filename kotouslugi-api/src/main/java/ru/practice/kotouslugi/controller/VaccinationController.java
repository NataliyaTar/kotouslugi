package ru.practice.kotouslugi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Vaccine;
import ru.practice.kotouslugi.service.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination")
public class VaccinationController {

  private final VaccinationService vaccinationService;

  @Autowired
  public VaccinationController(VaccinationService vaccinationService) {
    this.vaccinationService = vaccinationService;
  }

  @GetMapping("/all")
  public ResponseEntity<List<Vaccine>> getAllVaccines() {
    List<Vaccine> vaccines = vaccinationService.getAllVaccines();
    return ResponseEntity.ok(vaccines);
  }

}

