package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.practice.kotouslugi.service.VetPassportService;

@RestController
@RequestMapping("/api")
@Tag(name = "VetPassportController", description = "Методы для работы с услугой «Ветеринарный паспорт»")
public class VetPassportController extends BaseController {
  private final VetPassportService vetPassportService;

  public VetPassportController(VetPassportService vetPassportService) {
    this.vetPassportService = vetPassportService;
  }

  @PostMapping(value = "/vet-passport", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
  @ResponseBody
  @Operation(summary = "Создать ветеринарный паспорт", tags = {"Котоуслуги", "Ветеринарный паспорт"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Integer> createVetPassport(@RequestParam("data") String data,
                                                   @RequestParam(value = "photo", required = false) MultipartFile photo) {
    return wrapper((s) -> vetPassportService.createVetPassport(data, photo));
  }
}
