package ru.practice.kotouslugi.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Grooming;
import ru.practice.kotouslugi.service.GroomingService;


@Controller
@RequestMapping("/api/grooming")
@Tag(name = "GroomingController", description = "...")
public class GroomingController extends BaseController {
  private final GroomingService groomingService;

  public GroomingController(GroomingService groomingService) {
    this.groomingService = groomingService;
  }





  @PostMapping(value = "/add", produces = "application/json")
  @ResponseBody
  @Operation(summary = "Добавить запись на груминг", tags = {"Кошачье АПИ"}, responses = {
    @ApiResponse(responseCode = "200", description = "OK"),
    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
  )
  public ResponseEntity<Long> addGrooming(@RequestBody Grooming grooming) {
    return wrapper((s) -> groomingService.addGrooming(grooming));
  }


}
