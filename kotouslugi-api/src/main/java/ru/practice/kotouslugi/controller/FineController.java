package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Fine;
import ru.practice.kotouslugi.service.FineService;

import java.util.List;

@RestController
@RequestMapping("/api/fine")
@Tag(name = "FineController", description = "Методы для работы со штрафами котов")
public class FineController extends BaseController {
    private final FineService fineService;

  public FineController(FineService fineService) {
    this.fineService = fineService;
  }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список всех штрафов", tags = {"Штрафы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Fine> listFines() {
      return fineService.listFines();
    }

    @GetMapping(value = "/listByCat", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить штрафы конкретного кота", tags = {"Штрафы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Fine> listFinesByCat(@Parameter(name = "catId", required = true) @RequestParam Long catId) {
      return fineService.listFinesByCat(catId);
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить штраф по идентификатору", tags = {"Штрафы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Fine> getFine(@Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> fineService.getFine(id));
    }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить штраф", tags = {"Штрафы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addFine(@RequestBody Fine fine) {
        return wrapper((s) -> fineService.addFine(fine));
    }

    @PostMapping(value = "/pay", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Оплатить штраф", tags = {"Штрафы"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Fine> payFine(@Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> fineService.payFine(id));
    }
}
