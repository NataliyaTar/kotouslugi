package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;
import ru.practice.kotouslugi.service.ForeignPasswordService;
import ru.practice.kotouslugi.model.FP.PersonalData;
import ru.practice.kotouslugi.model.FP.ForeignPassword;

@RestController
@RequestMapping("/api/foreign-passport")
public class ForeignPassportController extends BaseController {
    private final ForeignPasswordService foreignPasswordService;

  public ForeignPassportController(ForeignPasswordService foreignPasswordService) {
    this.foreignPasswordService = foreignPasswordService;
  }


    @PostMapping(value = "/step1", produces = "application/json")
    @ResponseBody
    @Operation(
      summary = "Шаг 1 в заполнении заявления",
      description = """
        Принимает данные о коте из формы в формате JSON.
        Создает заявление с PersonalData(заполняется на основе формы заполненной пользователем,
        Metadata и ProcessingStatus билдятся сами.
        """,
      tags = {"Загранпаспорт"},
      responses = {// дописать остальные статусы
        @ApiResponse(
          responseCode = "200",
          description = "Заявление создано и добавлено в БД."
        ),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")
      }
    )

    public ForeignPassword addParam(@RequestBody PersonalData personalData) {
      return foreignPasswordService.addParam(personalData);
    }


  /// Другие ручки coming soon ///
}
