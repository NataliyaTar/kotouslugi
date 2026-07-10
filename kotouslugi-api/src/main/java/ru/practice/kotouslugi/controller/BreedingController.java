package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.Breeding;
import ru.practice.kotouslugi.service.BreedingService;

import java.util.List;

@RestController
@RequestMapping("/api/breeding")
@Tag(name = "BreedingController", description = "Методы для работы с подбором партнеров")
public class BreedingController extends BaseController {

  private final BreedingService breedingService;

  public BreedingController(BreedingService breedingService) {
    this.breedingService = breedingService;
  }

  @PostMapping(value = "/profile/add", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Создать анкету кошки для вязки", tags = {"Вязка кошек"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Long> createProfile(@RequestBody Breeding profile) {
    return this.<Long>wrapper((s) -> breedingService.createProfile(profile));
  }

  @GetMapping(value = "/matches", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Получить список подходящих партнеров", tags = {"Вязка кошек"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<List<Breeding>> getMatches(@RequestParam Long profileId) {
    return this.<List<Breeding>>wrapper((s) -> breedingService.findMatches(profileId));
  }

  @PostMapping(value = "/request/status", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Принять или отклонить запрос на вязку", tags = {"Вязка кошек"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Void> updateStatus(@RequestParam Long requestId, @RequestParam String status) {
    return this.<Void>wrapper((s) -> {
      breedingService.updateRequestStatus(requestId, status);
      return null;
    });
  }
  @DeleteMapping(value = "/profile/delete", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Удалить анкету кошки", tags = {"Вязка кошек"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Void> deleteProfile(@RequestParam Long profileId) {
    return this.<Void>wrapper((s) -> {
      breedingService.deleteProfile(profileId);
      return null;
    });
  }
}
