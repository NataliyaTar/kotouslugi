package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Cat;
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.service.FitnessService;

import java.util.List;

@RestController
@RequestMapping("/api/fitness_club")
@Tag(name = "FitnessController", description = "Методы для работы с API фитнес-клубов (работа со списком)")
/** Контроллер, выполняющий работу со списком фитнес-клубов
 *
 * @author Роман Бурцев
 * @authon Свободные места
 * */
public class FitnessController extends BaseController {
    private final FitnessService fitnessService;

    public FitnessController(FitnessService fitnessService) {this.fitnessService = fitnessService; }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список фитнес-клубов", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Fitness> listFitness() { return fitnessService.listFitness(); }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить фитнес-клуб", tags = {"API фитнес-клубов"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addFitness(@RequestBody Fitness fitness) {
        return wrapper((s) -> fitnessService.addFitness(fitness));
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить фитнес-клуб по идентификатору", tags = {"API фитнес-клубов"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Fitness> getFitness(@Parameter(name = "id", required = true) @RequestParam Long id) {
      return wrapper((s) -> fitnessService.getFitness(id));
    }

    @DeleteMapping(value = "deleteFitness", produces = "application/json")
    @Operation(summary = "Удалить фитнес-клуб", tags = {"API фитнес-клубов"}, responses = {
      @ApiResponse(responseCode = "200", description = "OK"),
      @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void deleteFitness(@RequestParam Long id) {
    fitnessService.deleteFitness(id);
  }
}
