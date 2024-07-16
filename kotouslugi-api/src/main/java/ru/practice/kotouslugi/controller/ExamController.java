package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.Exam;
import ru.practice.kotouslugi.service.ExamService;

import java.util.List;

@RestController
@RequestMapping("/api/exam")
@Tag(name = "ExamController", description = "Методы для работы с АПИ экзаменов пользователей")
public class ExamController extends BaseController {
  private final ExamService examService;

  public ExamController(ExamService examService) {
    this.examService = examService;
  }

  @GetMapping("/cat/{catId}")
  @ResponseBody
  @Operation(summary = "Получить список экзаменов для кота", tags = {"АПИ для экзаменов"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public List<Exam> findExamsByCatId(@PathVariable Long catId) {
    return examService.findExamsByCatId(catId);
  }
}
