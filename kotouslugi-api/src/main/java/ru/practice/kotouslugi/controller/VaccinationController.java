package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "VaccinationController", description = "Методы для работы с типами вакцинаций")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping("/all")
    @Operation(summary = "Список всех вакцин")
    public ResponseEntity<List<Vaccine>> getAllVaccines() {
        List<Vaccine> vaccines = vaccinationService.getAllVaccines();
        return ResponseEntity.ok(vaccines);
    }

    @PostMapping("/add")
    @Operation(summary = "Добавить новую вакцину")
    public ResponseEntity<Vaccine> addVaccine(@RequestBody VaccineDTO vaccineDTO) {
        Vaccine newVaccine = vaccinationService.addVaccine(vaccineDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newVaccine);
    }
}
