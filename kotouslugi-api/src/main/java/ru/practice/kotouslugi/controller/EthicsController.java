package ru.practice.kotouslugi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.EthicsRecord;
import ru.practice.kotouslugi.request.EthicsRequest;
import ru.practice.kotouslugi.service.EthicsService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ethics")
public class EthicsController extends BaseController {
  private final EthicsService ethicsService;

  public EthicsController(EthicsService ethicsService) {
    this.ethicsService = ethicsService;
  }

  /* Проверка доступности времени (GET /api/ethics/check?startTime=2025-12-31T15:30:00)
   */
  @GetMapping("/check")
  public ResponseEntity<Boolean> checkTimeSlot(
    @RequestParam LocalDateTime startTime
  ) {
    boolean isAvailable = ethicsService.isTimeSlotAvailable(startTime);
    return ResponseEntity.ok(isAvailable);
  }

  /* Добавление новой записи (POST /api/ethics/add)
   */
  @PostMapping("/add")
  public ResponseEntity<String> addRecord(
    @RequestBody EthicsRequest ethicsRequest
  ) {
    boolean isAdded = ethicsService.addEthicsRecord(
      ethicsRequest.getCatName(),
      ethicsRequest.getStartTime(),
      ethicsRequest.getCourseType(),
      ethicsRequest.getTeacherName(),
      ethicsRequest.getTeacherAbout(),
      ethicsRequest.getOwnerName(),
      ethicsRequest.getPhoneNumber(),
      ethicsRequest.getEmail()
    );

    if (isAdded) {
      return ResponseEntity.ok("Запись успешно добавлена!");
    } else {
      return ResponseEntity.badRequest().body("Это время уже занято.");
    }
  }
}
