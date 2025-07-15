package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.enums.StatementStatus;
import ru.practice.kotouslugi.service.BankService;

@RestController
@RequestMapping("/api/bank")
@Tag(name = "", description = "")
public class BankController extends BaseController {
  private final BankService bankService;

  @Autowired
  public BankController(BankService bankService) {
    this.bankService = bankService;
  }

  @PostMapping("/payment_duty")
  @Operation(summary = "",
    description = "",
    responses = {
      @ApiResponse(responseCode = "200", description = ""),
      @ApiResponse(responseCode = "400", description = ""),
      @ApiResponse(responseCode = "500", description = "")
    })

  public StatementStatus paymentDuty(@RequestBody String message) throws InterruptedException {
    return bankService.paymentDuty(message);
  };
}
