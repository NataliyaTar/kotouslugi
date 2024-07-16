package ru.practice.kotouslugi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.dto.VaccineDTO;
import ru.practice.kotouslugi.model.Vaccine;
import ru.practice.kotouslugi.service.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Vaccine>> getAllVaccines() {
        List<Vaccine> vaccines = vaccinationService.getAllVaccines();
        return ResponseEntity.ok(vaccines);
    }

    @PostMapping("/add")
    public ResponseEntity<Vaccine> addVaccine(@RequestBody VaccineDTO vaccineDTO) {
        Vaccine newVaccine = vaccinationService.addVaccine(vaccineDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newVaccine);
    }
}
