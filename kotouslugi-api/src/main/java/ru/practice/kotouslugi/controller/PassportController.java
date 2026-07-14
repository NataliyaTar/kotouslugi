package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.exception.DuplicateEntityException;
import ru.practice.kotouslugi.model.DecisionPassportDTO;
import ru.practice.kotouslugi.model.PassportDTO;
import ru.practice.kotouslugi.service.CatPassportService;

import java.util.List;

@RestController
@RequestMapping("/api/passport")
public class PassportController extends BaseController{
  @Autowired
  private CatPassportService catPassportService;

  @PostMapping(value = "/add", produces = "application/json")
  @Operation(summary = "Добавить паспорт кота", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "201", description = "Created"),
    @ApiResponse(responseCode = "404", description = "Requisition not found"),
    @ApiResponse(responseCode = "409", description = "Duplicate passport number"),
    @ApiResponse(responseCode = "500", description = "Internal error")})
  public ResponseEntity<Object> addPassport(@RequestBody PassportDTO passportDTO){
    PassportDTO res = catPassportService.addCatPassport(passportDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(res);
  }

  @PostMapping(value = "/approve", produces = "application/json")
  @Operation(summary = "Подтвердить паспорт кота", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")})
  public ResponseEntity<PassportDTO> approvePassport(@RequestBody DecisionPassportDTO decisionPassportDTO){
    PassportDTO decisionPassport = catPassportService.approvePassport(decisionPassportDTO);
    return ResponseEntity.status(200).body(decisionPassport);
  }
  @PostMapping(value = "/reject", produces = "application/json")
  @Operation(summary = "Отклонить паспорт кота", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")})
  public ResponseEntity<PassportDTO> rejectPassport(@RequestBody DecisionPassportDTO decisionPassportDTO){
    return wrapper((p) -> catPassportService.rejectPassport(decisionPassportDTO));
  }

  @PostMapping(value = "/getAll", produces = "application/json")
  @Operation(summary = "Получить все паспорта", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")})
  public ResponseEntity<List<PassportDTO>> getAllPassports(){
      List<PassportDTO> list = catPassportService.getPassports();
      return ResponseEntity.ok(list);
  }
}

