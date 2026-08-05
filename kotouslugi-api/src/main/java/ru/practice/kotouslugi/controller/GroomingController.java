package ru.practice.kotouslugi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.practice.kotouslugi.model.Groomer;
import ru.practice.kotouslugi.model.GroomingAppointment;
import ru.practice.kotouslugi.model.GroomingReview;
import ru.practice.kotouslugi.model.GroomingSalon;
import ru.practice.kotouslugi.model.dto.GroomingNotificationDto;
import ru.practice.kotouslugi.model.dto.GroomingReviewRequest;
import ru.practice.kotouslugi.model.dto.GroomingSlotDto;
import ru.practice.kotouslugi.service.GroomingService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/grooming")
@Tag(name = "GroomingController", description = "Запись котиков к грумеру")
public class GroomingController extends BaseController {
    private final GroomingService groomingService;

    public GroomingController(GroomingService groomingService) {
        this.groomingService = groomingService;
    }

    @GetMapping(value = "/salons", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список салонов груминга", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<GroomingSalon>> listSalons() {
        return wrapper((s) -> groomingService.listSalons());
    }

    @GetMapping(value = "/groomers", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список грумеров в салоне", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<Groomer>> listGroomers(
            @Parameter(name = "salonId", required = true) @RequestParam Long salonId) {
        return wrapper((s) -> groomingService.listGroomers(salonId));
    }

    @GetMapping(value = "/slots", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Доступные слоты в салоне", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<GroomingSlotDto>> listSlots(
            @Parameter(name = "salonId", required = true) @RequestParam Long salonId,
            @Parameter(name = "visitDate", required = true) @RequestParam String visitDate) {
        return wrapper((s) -> groomingService.listAvailableSlots(salonId, LocalDate.parse(visitDate)));
    }

    @GetMapping(value = "/appointments", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список записей к грумеру", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<GroomingAppointment>> listAppointments(
            @Parameter(name = "catId", required = false) @RequestParam(required = false) Long catId) {
        return wrapper((s) -> groomingService.listAppointments(catId));
    }

    @GetMapping(value = "/notifications", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Список уведомлений по грумингу", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<List<GroomingNotificationDto>> listNotifications(
            @Parameter(name = "catId", required = false) @RequestParam(required = false) Long catId) {
        return wrapper((s) -> groomingService.listNotifications(catId));
    }

    @PostMapping(value = "/review", produces = "application/json")
    @ResponseBody
    @Operation(summary = "Оставить отзыв о посещении салона", tags = {"Груминг"}, responses = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка")}
    )
    public ResponseEntity<GroomingReview> submitReview(
            @Parameter(name = "request", required = true) @RequestBody GroomingReviewRequest request) {
        return wrapper((s) -> groomingService.submitReview(request));
    }
}
