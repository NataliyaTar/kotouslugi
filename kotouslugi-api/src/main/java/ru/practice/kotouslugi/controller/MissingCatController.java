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
import org.springframework.web.multipart.MultipartHttpServletRequest;
import ru.practice.kotouslugi.service.MissingCatService;

@RestController
@RequestMapping("/api")
@Tag(name = "MissingCatController", description = "Методы для работы с услугой «Поиск пропавших котиков»")
public class MissingCatController extends BaseController {
  private final MissingCatService missingCatService;

  public MissingCatController(MissingCatService missingCatService) {
    this.missingCatService = missingCatService;
  }

  @PostMapping(value = "/missing-cat", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
  @ResponseBody
  @Operation(summary = "Создать заявку о пропавшем котике", tags = {"Котоуслуги", "Поиск пропавших котиков"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Integer> createMissingCat(@RequestParam("data") String data,
                                                  MultipartHttpServletRequest request) {
    return wrapper((s) -> missingCatService.createMissingCat(data, request.getFileMap()));
  }
}
