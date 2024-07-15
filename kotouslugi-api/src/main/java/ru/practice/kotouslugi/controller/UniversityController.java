package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.University;
import ru.practice.kotouslugi.service.UniversityService;

import java.util.List;

@RestController
@RequestMapping("/api/university")
@Tag(name = "UniversityController", description = "Методы для работы с АПИ университетов")
public class UniversityController extends BaseController {
  private final UniversityService universityService;

  public UniversityController(UniversityService universityService) {
    this.universityService = universityService;
  }

  @GetMapping("/eligible")
  @ResponseBody
  @Operation(summary = "Получить список университетов подходящих по сумме баллов для кота", tags = {"АПИ для экзаменов"}, responses = {
    @ApiResponse(responseCode = "200", description = "ОК"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public List<University> findUniversitiesByScore(@RequestParam Integer score) {
    return universityService.findUniversitiesByScore(score);
  }
}
