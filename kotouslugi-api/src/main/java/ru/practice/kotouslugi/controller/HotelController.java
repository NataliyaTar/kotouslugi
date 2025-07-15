package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.HotelRecord;
import ru.practice.kotouslugi.service.CatService;
import ru.practice.kotouslugi.service.HotelRecordService;
import ru.practice.kotouslugi.service.HotelService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel")
@Tag(name = "HotelController", description = "Методы для работы с передержкой котиков")
public class HotelController extends BaseController {

  private final HotelRecordService hotelRecordService;
  private final CatService catService;
  private final HotelService hotelService;

  public HotelController(
          HotelRecordService hotelRecordService,
          CatService catService,
          HotelService hotelService
  ) {
    this.hotelRecordService = hotelRecordService;
    this.catService = catService;
    this.hotelService = hotelService;
  }

  @GetMapping("/check-space")
  @Operation(summary = "Проверить наличие свободного места", responses = {
          @ApiResponse(responseCode = "200", description = "OK"),
          @ApiResponse(responseCode = "400", description = "Некорректные параметры")
  })
  public ResponseEntity<Boolean> checkSpace(
          @RequestParam Long hotelId,
          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
  ) {
    boolean available = hotelRecordService.checkSpace(hotelId, startDate, endDate);
    return ResponseEntity.ok(available);
  }

  @GetMapping("/options")
  @Operation(summary = "Получить котов и отели")
  public Map<String, Object> getOptions() {
    Map<String, Object> result = new HashMap<>();
    result.put("cats", catService.listCat());
    result.put("hotels", hotelService.listHotels());
    return result;
  }

  @PostMapping("/book")
  @Operation(summary = "Записать котика на передержку", responses = {
          @ApiResponse(responseCode = "200", description = "Успешно"),
          @ApiResponse(responseCode = "400", description = "Ошибка в данных")
  })
  public ResponseEntity<Map<String, Object>> bookOverexposure(@RequestBody HotelRecord request) {
    HotelRecord savedRecord = hotelRecordService.saveRecord(request);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Котик успешно записан на передержку!");
    response.put("recordId", savedRecord.getId());

    return ResponseEntity.ok(response);
  }
}
