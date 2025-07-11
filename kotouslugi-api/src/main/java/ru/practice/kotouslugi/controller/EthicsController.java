package ru.practice.kotouslugi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.service.EthicsService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ethics")
public class EthicsController {
  private final EthicsService ethicsService;

  public EthicsController(EthicsService ethicsService) {
    this.ethicsService = ethicsService;
  }

  /**
   * Проверка доступности времени (GET /api/ethics/check?startTime=2025-12-31T15:30:00)
   */
  @GetMapping("/check")
  public ResponseEntity<Boolean> checkTimeSlot(
    @RequestParam LocalDateTime startTime
  ) {
    boolean isAvailable = ethicsService.isTimeSlotAvailable(startTime);
    return ResponseEntity.ok(isAvailable);
  }

  /**
   * Добавление новой записи (POST /api/ethics/add)
   */
  @PostMapping("/add")
  public ResponseEntity<String> addRecord(
    @RequestParam String catName,
    @RequestParam LocalDateTime startTime,
    @RequestParam String courseType,
    @RequestParam String teacherName,
    @RequestParam String teacherAbout,
    @RequestParam String ownerName,
    @RequestParam String phoneNumber,
    @RequestParam(required = false) String email
  ) {
    boolean isAdded = ethicsService.addEthicsRecord(
      catName, startTime, courseType, teacherName,
      teacherAbout, ownerName, phoneNumber, email
    );

    if (isAdded) {
      return ResponseEntity.ok("Запись успешно добавлена!");
    } else {
      return ResponseEntity.badRequest().body("Это время уже занято.");
    }
  }
}
