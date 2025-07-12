package ru.practice.kotouslugi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.service.EthicsFeedbackService;

@RestController
@RequestMapping("/api/ethicsFeedback")
public class EthicsFeedbackController {
  private final EthicsFeedbackService ethicsFeedbackService;

  public EthicsFeedbackController(EthicsFeedbackService ethicsFeedbackService) {
    this.ethicsFeedbackService = ethicsFeedbackService;
  }

  @GetMapping("/add")
  public ResponseEntity<String> addFeedback(
    @RequestParam int rating,
    @RequestParam String comment
  ) {
    boolean isAdded = ethicsFeedbackService.addEthicsFeedback(
      rating,
      comment);
    if (isAdded) {
      return ResponseEntity.ok("Отзыв добавлен!");
    } else {
      return ResponseEntity.badRequest().body("Отзыв уже существует!");
    }
  }
}
