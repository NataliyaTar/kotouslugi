package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.StatementForPassport;
import ru.practice.kotouslugi.service.MvdService;

@RestController
@RequestMapping("/api/mvd")
@Tag(name = "MVD API", description = "API для взаимодействия с МВД")
public class MvdController extends BaseController {
  private final MvdService mvdService;

  @Autowired
  public MvdController(MvdService mvdService) {
    this.mvdService = mvdService;
  }

  @PostMapping("/verify-passport")
  @Operation(summary = "Проверка данных заграничного паспорта",
    description = "Проверяет и выставляет новый статус в МВД",
    responses = {
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "400", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    })

  public StatementForPassport verifyForeignPassport(@RequestBody StatementForPassport statementForPassport) throws InterruptedException {
    return mvdService.verify_in_mvd(statementForPassport);
  };
}
