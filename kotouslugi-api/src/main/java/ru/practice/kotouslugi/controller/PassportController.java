package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.model.MainEntity;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.request.BankRequest;
import ru.practice.kotouslugi.request.FeedbackRequest;
import ru.practice.kotouslugi.service.PasswordService;

@RestController
@RequestMapping("/api/foreign-passport")
public class PassportController extends BaseController {
  private final PasswordService foreignPasswordService;

  public PassportController(PasswordService foreignPasswordService) {
    this.foreignPasswordService = foreignPasswordService;
  }


  @PostMapping(value = "/add-statement-for-passport", produces = "application/json")
  @ResponseBody
  @Operation(
    summary = "Заполнение формы для паспорта",
    description = "Добавляется в БД. Содержит полную обработку от МВД.",
    tags = {"Загранпаспорт"},
    responses = {// дописать остальные статусы
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "400", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    }
  )
  public MainEntity addStatementForPassport(@RequestBody @Valid StatementForPassport statementForPassport) {
    return foreignPasswordService.addStatementForPassport(statementForPassport);
  }


  // не используется на фронте (вся логика в /add-statement-for-passport)
  @PostMapping(value = "/payment-of-duty", produces = "application/json")
  @ResponseBody
  @Operation(
    summary = "Оплата пошлины",
    description = "",
    tags = {"Загранпаспорт"},
    responses = {// дописать остальные статусы
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    }
  )
  public MainEntity payment_duty(@RequestBody BankRequest request) {
    return foreignPasswordService.payment_duty(request.getId());
  }


  // не используется на фронте (вся логика в /add-statement-for-passport)
  @PostMapping(value = "/add-feedback", produces = "application/json")
  @ResponseBody
  @Operation(
    summary = "Заполнение отзыва",
    description = "",
    tags = {"Загранпаспорт"},
    responses = {// дописать остальные статусы
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    }
  )
  public MainEntity addFeedback(@RequestBody FeedbackRequest feedbackRequest) {
    return foreignPasswordService.addFeedback(feedbackRequest);
  }
}
