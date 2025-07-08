package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.FP.ForeignPassword;
import ru.practice.kotouslugi.service.MvdEmulatorService;

@RestController
@RequestMapping("/api/mvd")
@Tag(name = "MVD Emulator API", description = "API для эмуляции взаимодействия с МВД")
public class MvdEmulatorController extends BaseController {

  private static final Logger logger = LoggerFactory.getLogger(MvdEmulatorController.class);
  private final MvdEmulatorService mvdEmulatorService;

  @Autowired
  public MvdEmulatorController(MvdEmulatorService mvdEmulatorService) {
    this.mvdEmulatorService = mvdEmulatorService;
  }

  @PostMapping("/verify-foreign-passport")
  @Operation(summary = "Проверка данных заграничного паспорта",
    description = "Эмулирует проверку данных паспорта через МВД",
    responses = {
      @ApiResponse(responseCode = "200", description = "Проверка успешно завершена"),
      @ApiResponse(responseCode = "400", description = "Неверные входные данные"),
      @ApiResponse(responseCode = "500", description = "Ошибка при обработке запроса")
    })

  public ForeignPassword verifyForeignPassport(@RequestBody ForeignPassword foreignPassword){
    return mvdEmulatorService.sent_to_mvd(foreignPassword);
  };
}
