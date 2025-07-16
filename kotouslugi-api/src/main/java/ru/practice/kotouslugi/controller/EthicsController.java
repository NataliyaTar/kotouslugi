package ru.practice.kotouslugi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.EthicsRecord;
import ru.practice.kotouslugi.service.EthicsService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ethics")
public class EthicsController extends BaseController {
  private final EthicsService ethicsService;

  public EthicsController(EthicsService ethicsService) {
    this.ethicsService = ethicsService;
  }

  @GetMapping("/check")
  public ResponseEntity<Boolean> checkTimeSlot(
    @RequestParam LocalDateTime startTime
  ) {
    boolean isAvailable = ethicsService.isTimeSlotAvailable(startTime);
    return ResponseEntity.ok(isAvailable);
  }

  @PostMapping(value = "/add", produces = "application/json")
  public ResponseEntity<String> addRecord(
    @RequestBody EthicsRecord ethicsRecord
  ) {
    boolean isAdded = ethicsService.addEthicsRecord(ethicsRecord);

    if (isAdded) {
      return ResponseEntity.ok("Запись успешно добавлена!");
    } else {
      return ResponseEntity.badRequest().body("Это время уже занято.");
    }
  }
}
