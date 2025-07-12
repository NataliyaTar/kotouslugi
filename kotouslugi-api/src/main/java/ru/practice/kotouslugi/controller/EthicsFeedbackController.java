package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.EthicsFeedback;
import ru.practice.kotouslugi.request.EthicsFeedbackRequest;
import ru.practice.kotouslugi.service.EthicsFeedbackService;

import java.util.List;

@RestController
@RequestMapping("/api/ethicsFeedback")
public class EthicsFeedbackController {
  private final EthicsFeedbackService ethicsFeedbackService;

  public EthicsFeedbackController(EthicsFeedbackService ethicsFeedbackService) {
    this.ethicsFeedbackService = ethicsFeedbackService;
  }

  @PostMapping(value = "/add", produces = "application/json")
  @Operation(summary = "Добавить отзыв", tags = {"АПИ отзывов"}, responses = {
    @ApiResponse(responseCode = "200", description = "Ок"),
    @ApiResponse(responseCode = "400", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<String> addFeedback(
    @RequestBody EthicsFeedbackRequest ethicsFeedbackRequest
    ) {
    boolean isAdded = ethicsFeedbackService.addEthicsFeedback(
      ethicsFeedbackRequest.getRating(),
      ethicsFeedbackRequest.getComment()
    );
    if (isAdded) {
      return ResponseEntity.ok("Отзыв добавлен!");
    } else {
      return ResponseEntity.badRequest().body("Отзыв уже существует!");
    }
  }
  @GetMapping("/all")
  @Operation(summary = "Получить все отзывы", tags = {"АПИ отзывов"})
  public ResponseEntity<List<EthicsFeedback>> getAllFeedbacks() {
    List<EthicsFeedback> feedbacks = ethicsFeedbackService.getAllFeedbacks();
    return ResponseEntity.ok(feedbacks);
  }
}
