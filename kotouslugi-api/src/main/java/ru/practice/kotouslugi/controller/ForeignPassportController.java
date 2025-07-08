package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
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


    @PostMapping(value = "/sent_to_mvd", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить данные из формы", tags = {"Кошачье АПИ"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ForeignPassword addParam(@RequestBody PersonalData personalData) {
      return foreignPasswordService.addParam(personalData);
    }
}
