package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.ErrorResponse;
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
    summary = "Создание заявления на загранпаспорт",
    description = """
        ### Полный цикл обработки заявления на загранпаспорт:
        1. Сохранение заявления в базу данных
        2. Создание основной сущности для отслеживания статуса
        3. Отправка данных в МВД для верификации паспорта
        4. Обработка ответа от МВД (успех/отклонение/ошибка)
        5. При успешной верификации - автоматическая отправка данных в банк для оплаты госпошлины
        6. Обновление статуса заявления на основе ответа от банка

        ### Возможные статусы заявления:
        - **CREATED** - заявление создано
        - **SENT_TO_MVD** - отправлено в МВД
        - **READY_IN_MVD** - успешная верификация МВД
        - **REJECTED_IN_MVD** - отклонено МВД
        - **ERROR_IN_MVD** - ошибка при обработке в МВД
        - **SENT_TO_BANK** - отправлено в банк
        - **APPROVED_BY_BANK** - успешная оплата госпошлины
        - **REJECTED_IN_BANK** - отклонено банком
        - **ERROR_IN_BANK** - ошибка при обработке в банк
        """,
    tags = {"Загранпаспорт"},
    responses = {
      @ApiResponse(
        responseCode = "201",
        description = "Заявление успешно создано",
        content = @Content(schema = @Schema(implementation = MainEntity.class))),
      @ApiResponse(
        responseCode = "400",
        description = "Неверные входные данные: отсутствуют обязательные поля или неверный формат данных",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
      @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка сервера",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
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
    responses = {
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    }
  )
  public MainEntity payment_duty(@RequestBody BankRequest request) {
    return foreignPasswordService.paymentDuty(request.getId());
  }


  // не используется на фронте (вся логика в /add-statement-for-passport)
  @PostMapping(value = "/add-feedback", produces = "application/json")
  @ResponseBody
  @Operation(
    summary = "Заполнение отзыва",
    description = "",
    tags = {"Загранпаспорт"},
    responses = {
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    }
  )
  public MainEntity addFeedback(@RequestBody FeedbackRequest feedbackRequest) {
    return foreignPasswordService.addFeedback(feedbackRequest);
  }
}
