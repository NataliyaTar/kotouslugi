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
import ru.practice.kotouslugi.model.Fitness;
import ru.practice.kotouslugi.model.Trainer;
import ru.practice.kotouslugi.service.TrainerService;

import java.util.List;

@RestController
@RequestMapping("/api/fitness_trainers")
@Tag(name = "TrainerController", description = "Методы для работы с API тренеров")
/** Контроллер, выполняющий работу со списком тренеров фитнес-клубов
 *
 * @author Роман Бурцев
 * @authon Свободные места
 * */
public class TrainerController extends BaseController {
    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) { this.trainerService = trainerService; }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список тренеров фитнес-клубов", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Trainer> listTrainers() { return trainerService.listTrainers(); }

    @GetMapping(value = "listByFitnessClubId", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить список тренеров по ID фитнес-клуба", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public List<Trainer> listByFitnessClubId(@Parameter(name = "fitness_club_id", required = true) @RequestParam Long id) {
        return trainerService.listTrainersByFitnessClubId(id);
    }

    @PostMapping(value = "/add", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Добавить тренера фитнес-клуба", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Long> addTrainer(@RequestBody Trainer trainer) {
        return wrapper((s) -> trainerService.addTrainer(trainer));
    }

    @GetMapping(value = "/get", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Получить тренера фитнес-клуба по идентификатору", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<Trainer> getTrainer(@Parameter(name = "id", required = true) @RequestParam Long id) {
        return wrapper((s) -> trainerService.getTrainer(id));
    }

    @DeleteMapping(value = "/delete", produces = "application/json")
    @Operation(summary = "Удалить тренера фитнес-клуба", tags = {"API фитнес-клубов"}, responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public void deleteTrainer(@RequestParam Long id) {
      trainerService.deleteTrainer(id);
    }
}
